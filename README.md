# Supabase Keep-Alive

A lightweight solution to keep your Supabase projects alive by periodically pinging them using GitHub Actions.

## Why?

Supabase free-tier projects pause after a period of inactivity. This script automatically pings your projects to prevent them from going inactive.

## Features

- ✅ Support for multiple Supabase projects
- ✅ Zero dependencies (uses Node.js built-in modules)
- ✅ Runs automatically via GitHub Actions
- ✅ Configurable ping schedule
- ✅ Detailed logging and error reporting
- ✅ Manual trigger support
- ✅ **Secure**: Uses GitHub Secrets to keep your project URLs private

## Setup

### 1. Fork or Create Repository

Create a new repository or fork this one on GitHub.

### 2. Set Up GitHub Secret

Your Supabase project URLs will be stored securely as a GitHub Secret:

1. Go to your repository on GitHub
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Name: `SUPABASE_PROJECTS`
5. Value: Paste your projects configuration in JSON format:

```json
{
  "projects": [
    {
      "name": "My Project",
      "url": "https://your-project-id.supabase.co",
      "endpoint": "/rest/v1/"
    },
    {
      "name": "Another Project",
      "url": "https://another-project-id.supabase.co",
      "endpoint": "/rest/v1/"
    }
  ]
}
```

6. Click **Add secret**

**Note:** You can find your Supabase project URL in your project's settings under "API" > "Project URL".

**Important:** Make sure the JSON is properly formatted (no trailing commas, valid syntax). You can use a JSON validator to check.

### 3. Adjust Schedule (Optional)

By default, the script runs every 6 hours. To change this, edit `.github/workflows/keep-alive.yml`:

```yaml
on:
  schedule:
    # Examples:
    - cron: '0 */6 * * *'   # Every 6 hours
    # - cron: '0 */4 * * *' # Every 4 hours
    # - cron: '0 0 * * *'   # Once daily at midnight
    # - cron: '0 */12 * * *' # Every 12 hours
```

Use [crontab.guru](https://crontab.guru/) to help create custom cron schedules.

### 4. Enable GitHub Actions

1. Go to your repository on GitHub
2. Click on the **Actions** tab
3. If Actions are disabled, click **I understand my workflows, go ahead and enable them**

### 5. Verify It Works

You can manually trigger the workflow to test it:

1. Go to **Actions** tab in your GitHub repository
2. Click on **Supabase Keep-Alive** workflow
3. Click **Run workflow** dropdown button
4. Click the green **Run workflow** button
5. Wait a few seconds, then click on the workflow run to see the details
6. Check the logs under the "Run keep-alive script" step to see if your projects were pinged successfully

You should see output like:
```
==================================================
Supabase Keep-Alive Script
==================================================
[2024-01-01T00:00:00.000Z] Pinging My Project (https://your-project-id.supabase.co/rest/v1/)...
[2024-01-01T00:00:00.000Z] ✓ My Project - Status: 200
```

## How It Works

1. **GitHub Actions** triggers the workflow based on the cron schedule
2. **Script reads** your project configuration from the `SUPABASE_PROJECTS` secret
3. **HTTP HEAD requests** are sent to each project's endpoint (lightweight, no data transfer)
4. **Results are logged** showing success/failure for each project
5. **Keeps your projects active** preventing them from pausing

## Local Testing

You can test the script locally before deploying. Since the workflow only reads from the `SUPABASE_PROJECTS` environment variable, simply export it locally and run the script:

```bash
export SUPABASE_PROJECTS='{"projects":[{"name":"My Project","url":"https://your-project-id.supabase.co","endpoint":"/rest/v1/"}]}'
node keep-alive.js
# Or using npm
npm start
```

> 💡 **Tip:** Store the JSON in a `.env` file or your shell profile if you test frequently:
> ```
> SUPABASE_PROJECTS='{"projects":[...]}'
> ```
> Then run `source .env` before executing the script.

## Troubleshooting

### Projects still going inactive?

- Check that GitHub Actions is enabled in your repository
- Verify the workflow is running (check the "Actions" tab)
- Ensure your GitHub Secret `SUPABASE_PROJECTS` is set correctly
- Verify your project URLs are correct in the secret
- Try increasing the ping frequency (e.g., every 4 hours instead of 6)

### Workflow not running on schedule?

- GitHub Actions schedules can have a delay of up to 15 minutes
- Workflows may be disabled if the repository has no activity for 60 days
- Check the "Actions" tab for any error messages

### Getting errors in the logs?

- **"Error parsing SUPABASE_PROJECTS environment variable"**: Your JSON in the GitHub Secret is malformed. Check for:
  - Missing quotes around strings
  - Trailing commas
  - Unclosed brackets or braces
  - Use a JSON validator like [jsonlint.com](https://jsonlint.com/)
- **Connection errors**: Verify your project URLs are correct and accessible
- **Authentication errors**: The default `/rest/v1/` endpoint should work without authentication. Try `/auth/v1/health` if you have issues

## Advanced Configuration

### Using Different Endpoints

You can ping different endpoints for each project in your GitHub Secret:

```json
{
  "projects": [
    {
      "name": "My Project",
      "url": "https://your-project-id.supabase.co",
      "endpoint": "/rest/v1/"
    },
    {
      "name": "Another Project with Auth",
      "url": "https://another-project-id.supabase.co",
      "endpoint": "/auth/v1/health"
    },
    {
      "name": "Storage Project",
      "url": "https://third-project.supabase.co",
      "endpoint": "/storage/v1/healthcheck"
    }
  ]
}
```

### Adding More Projects

Simply add more project objects to the `projects` array in your `SUPABASE_PROJECTS` GitHub Secret. There's no limit to the number of projects you can add.

### Updating Your Projects

To update your project list:

1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Click on `SUPABASE_PROJECTS`
3. Click **Update secret**
4. Modify the JSON and save

## Privacy & Security

- ✅ This script only sends HEAD requests to your Supabase projects (no data transfer)
- ✅ No data is read or stored
- ✅ No authentication keys are required for basic keep-alive functionality
- ✅ **Your project URLs are encrypted** and stored as GitHub Secrets (not visible in code or logs)
- ✅ All configuration is stored securely in your own private repository
- ✅ Zero dependencies means no third-party code execution

**What should NEVER be committed:**
- ❌ `service_role` API keys
- ❌ Database passwords
- ❌ JWT secrets
- ❌ Any private API keys

**Note:** While Supabase project URLs are generally safe to expose (they're used in client-side applications), this solution uses GitHub Secrets for additional privacy and best practices.

## License

MIT

## Contributing

Feel free to open issues or submit pull requests with improvements!
