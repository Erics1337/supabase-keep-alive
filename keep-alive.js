#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Read configuration from environment variable
function getConfig() {
  if (process.env.SUPABASE_PROJECTS) {
    try {
      return JSON.parse(process.env.SUPABASE_PROJECTS);
    } catch (error) {
      console.error('Error parsing SUPABASE_PROJECTS environment variable:', error.message);
      process.exit(1);
    }
  }

  console.error('Missing SUPABASE_PROJECTS environment variable. Set it in GitHub Secrets or export it locally before running the keep-alive script.');
  process.exit(1);
}

const config = getConfig();

// Function to ping a single project
function pingProject(project) {
  return new Promise((resolve, reject) => {
    // Default to /rest/v1/ if no endpoint is specified, which is the PostgREST root
    const endpoint = project.endpoint || '/rest/v1/';
    const url = new URL(endpoint, project.url);
    const protocol = url.protocol === 'https:' ? https : http;

    if (!project.apikey) {
      console.error(`[${new Date().toISOString()}] ✗ ${project.name} - Error: Missing apikey in configuration`);
      resolve({ project: project.name, error: 'Missing apikey', success: false });
      return;
    }

    const options = {
      method: 'GET',
      timeout: 10000,
      headers: {
        'apikey': project.apikey,
        'Authorization': `Bearer ${project.apikey}`
      }
    };

    console.log(`[${new Date().toISOString()}] Pinging ${project.name} (${url.href})...`);

    const req = protocol.request(url, options, (res) => {
      console.log(`[${new Date().toISOString()}] ✓ ${project.name} - Status: ${res.statusCode}`);
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve({ project: project.name, status: res.statusCode, success: true });
      } else {
        resolve({ project: project.name, status: res.statusCode, error: `HTTP ${res.statusCode}`, success: false });
      }
    });

    req.on('error', (error) => {
      console.error(`[${new Date().toISOString()}] ✗ ${project.name} - Error: ${error.message}`);
      resolve({ project: project.name, error: error.message, success: false });
    });

    req.on('timeout', () => {
      req.destroy();
      console.error(`[${new Date().toISOString()}] ✗ ${project.name} - Timeout`);
      resolve({ project: project.name, error: 'Timeout', success: false });
    });

    req.end();
  });
}

// Main execution
async function main() {
  console.log('='.repeat(50));
  console.log('Supabase Keep-Alive Script');
  console.log('='.repeat(50));

  const results = await Promise.all(config.projects.map(pingProject));

  console.log('\n' + '='.repeat(50));
  console.log('Summary:');
  console.log('='.repeat(50));

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`Total projects: ${results.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFailed projects:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.project}: ${r.error}`);
    });
  }

  // Exit with error code if any failed
  process.exit(failed > 0 ? 1 : 0);
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
