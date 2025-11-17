#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const http = require('http');

// Read configuration
const config = JSON.parse(fs.readFileSync('config.json', 'utf8'));

// Function to ping a single project
function pingProject(project) {
  return new Promise((resolve, reject) => {
    const url = new URL(project.endpoint, project.url);
    const protocol = url.protocol === 'https:' ? https : http;

    const options = {
      method: 'HEAD',
      timeout: 10000
    };

    console.log(`[${new Date().toISOString()}] Pinging ${project.name} (${url.href})...`);

    const req = protocol.request(url, options, (res) => {
      console.log(`[${new Date().toISOString()}] ✓ ${project.name} - Status: ${res.statusCode}`);
      resolve({ project: project.name, status: res.statusCode, success: true });
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
