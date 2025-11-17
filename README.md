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

## Setup

### 1. Fork or Create Repository

Create a new repository or fork this one on GitHub.

### 2. Configure Your Projects

Edit the `config.json` file to add your Supabase projects:

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

**Note:** You can find your Supabase project URL in your project's settings under "API" > "Project URL".

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
2. Click on the "Actions" tab
3. If Actions are disabled, click "I understand my workflows, go ahead and enable them"

### 5. Verify It Works

You can manually trigger the workflow to test it:

1. Go to "Actions" tab in your GitHub repository
2. Click on "Supabase Keep-Alive" workflow
3. Click "Run workflow" button
4. Check the logs to see if your projects were pinged successfully

## How It Works

1. **GitHub Actions** triggers the workflow based on the cron schedule
2. **Script reads** the `config.json` file
3. **HTTP HEAD requests** are sent to each project's endpoint
4. **Results are logged** showing success/failure for each project
5. **Keeps your projects active** preventing them from pausing

## Local Testing

You can test the script locally before deploying:

```bash
# Run the script
node keep-alive.js

# Or using npm
npm start
```

## Troubleshooting

### Projects still going inactive?

- Check that GitHub Actions is enabled in your repository
- Verify the workflow is running (check the "Actions" tab)
- Ensure your `config.json` has correct project URLs
- Try increasing the ping frequency (e.g., every 4 hours instead of 6)

### Workflow not running on schedule?

- GitHub Actions schedules can have a delay of up to 15 minutes
- Workflows may be disabled if the repository has no activity for 60 days
- Check the "Actions" tab for any error messages

### Getting errors in the logs?

- Verify your project URLs are correct
- Check that the endpoints are accessible
- Some Supabase endpoints may require authentication (see Advanced Configuration)

## Advanced Configuration

### Using Different Endpoints

You can ping different endpoints for each project:

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
    }
  ]
}
```

### Adding More Projects

Simply add more project objects to the `projects` array in `config.json`. There's no limit to the number of projects you can add.

## Privacy & Security

- This script only sends HEAD requests to your Supabase projects
- No data is read or stored
- No authentication keys are required for basic keep-alive functionality
- All configuration is stored in your own repository

## License

MIT

## Contributing

Feel free to open issues or submit pull requests with improvements!
