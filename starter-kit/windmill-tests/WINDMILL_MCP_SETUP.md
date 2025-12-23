# Windmill MCP Integration Guide

## Overview

The Windmill Model Context Protocol (MCP) server enables Claude Code to directly interact with your Windmill workspace - running scripts, creating flows, managing resources, and monitoring jobs through natural language.

## What is MCP?

The Model Context Protocol is an open standard (donated to the Agentic AI Foundation in Dec 2025) that allows LLMs to connect to external tools and services. Windmill's MCP implementation uses **HTTP Server-Sent Events (SSE)** as the transport layer.

## Setup

### 1. Create MCP Token in Windmill

We've already created an MCP token for this workspace:

```
Token: l7MT85HyBnhhYZBiR7i04awiFLisY5hM
Created: 2025-12-22
Workspace: blueprint
```

**Security:** This token provides full access to the Windmill workspace. Treat it like an API key.

### 2. Configure Claude Code

The MCP server is configured in `.mcp.json` at the project root:

```json
{
  "mcpServers": {
    "windmill": {
      "url": "http://localhost:8000/api/mcp/w/blueprint/sse?token=l7MT85HyBnhhYZBiR7i04awiFLisY5hM"
    }
  }
}
```

**Note:** This is a local development setup. For production, use `https://app.windmill.dev` instead of `http://localhost:8000`.

### 3. Restart Claude Code

After adding `.mcp.json`, restart Claude Code to load the MCP server.

## Available Capabilities

### Jobs
- Run scripts and flows
- Monitor execution status
- Retrieve job logs and results
- Cancel running jobs

### Resources
- Create/read/update/delete third-party connections
- Manage API credentials
- Configure database connections

### Variables
- Set workspace variables
- Manage secrets
- Environment configuration

### Schedules
- Create CRON schedules
- Manage automated tasks
- View upcoming executions

### Workers
- Monitor worker status
- Check resource allocation
- View worker logs

## Example Usage

Once configured, you can interact with Windmill naturally:

```
User: "Run the parallel_execution test script in Windmill"
Claude: [Uses MCP to trigger u/clay/parallel_execution and shows results]

User: "Check the status of the last 5 jobs"
Claude: [Fetches recent job history via MCP]

User: "Create a new schedule to run the database backup script every night at 2am"
Claude: [Uses MCP to create a CRON schedule]
```

## Current Workspace State

### Scripts Available
- `u/clay/parallel_execution` - Tests Promise.all with concurrent operations
- `u/clay/memory_limits` - Tests large array handling
- `u/clay/database_stress` - Tests multiple DB connections
- `u/clay/complex_workflow` - Tests multi-stage workflows

All scripts have been tested and execute successfully.

### Apps Available
- `u/clay/test` - Working test app with tabs and containers (✅ renders)
- `u/clay/blueprint_ui_showcase` - Comprehensive UI showcase (⚠️ blank - incorrect format)
- `u/clay/simple_test` - Minimal test app (⚠️ blank - incorrect format)
- `u/clay/loan_dashboard` - Loan management dashboard (⚠️ blank - needs validation)

## MCP vs REST API

| Feature | MCP | REST API |
|---------|-----|----------|
| **Access Method** | Natural language via Claude | HTTP requests via scripts |
| **Authentication** | Token in URL | Cookie or token headers |
| **Use Case** | Ad-hoc exploration, debugging | Automated workflows, CI/CD |
| **Discoverability** | LLM finds available scripts | Must know endpoints |
| **Best For** | Development, testing | Production automation |

**Recommendation**: Use MCP for interactive development, REST API for programmatic automation.

## Important Discovery: MCP in Community Edition

### Current Status

After testing, we discovered that **MCP appears to require Windmill Enterprise or Cloud**. The Community Edition (CE) v1.595.0 has the `/api/mcp/` endpoint, but tokens created with `"scopes": ["mcp"]` still return:

```
Unauthorized: missing mcp scope
```

This suggests MCP is an Enterprise-tier feature not available in the open-source Community Edition.

### Workaround: Use REST API Directly

The good news: **You don't actually need MCP for production use!** The REST API provides everything MCP would offer:

```python
# Instead of MCP natural language
# Use the REST API directly

import requests

# Run a script
response = requests.post(
    f"{WINDMILL_BASE_URL}/api/w/{WORKSPACE}/jobs/run/p/{script_path}",
    json={"args": {}},
    cookies=cookies
)
```

See our test scripts for complete examples:
- `upload-and-run-all-tests.py` - Run scripts programmatically
- `get-job-results.py` - Fetch results

### When to Use Each

| Method | Use Case | Availability |
|--------|----------|--------------|
| **REST API** | Production automation, CI/CD | ✅ CE + Enterprise |
| **MCP** | Interactive development via Claude | ⚠️ Enterprise/Cloud only |
| **Windmill UI** | Manual testing, app creation | ✅ CE + Enterprise |

**Recommendation for Blueprint Connect 2.0**: Use REST API for all automation (which we're already doing successfully).

## Troubleshooting

### MCP Server Not Found

**Symptom**: Claude Code doesn't show Windmill MCP tools

**Solution**:
1. Verify `.mcp.json` is in project root
2. Restart Claude Code
3. Check that Windmill instance is running: `http://localhost:8000`

### 401 Unauthorized

**Symptom**: MCP requests fail with authentication error

**Solution**:
1. Regenerate MCP token in Windmill
2. Update token in `.mcp.json`
3. Restart Claude Code

### Scripts Not Discoverable

**Symptom**: MCP can't find your scripts

**Solution**:
- Ensure scripts have clear `summary` descriptions
- Scripts must be deployed (not just drafts)
- Consider enabling "favorites only" filtering in token settings

## Files Created

### Configuration
- `.mcp.json` - MCP server configuration (DO NOT COMMIT TOKEN TO GIT)
- `create-mcp-token.py` - Script to create new MCP tokens

### Documentation
- `WINDMILL_UI_FINDINGS.md` - UI testing results
- `WINDMILL_MCP_SETUP.md` - This file

## Security Best Practices

1. **Never commit `.mcp.json` with tokens** - Add to `.gitignore`
2. **Create separate tokens for dev/prod** - Use different workspaces
3. **Set token expiration** - Rotate tokens regularly
4. **Limit permissions** - Use "favorites only" for restricted access
5. **Monitor token usage** - Check for unauthorized access

## Production Configuration

For production use with Windmill Cloud:

```json
{
  "mcpServers": {
    "windmill-prod": {
      "url": "https://app.windmill.dev/api/mcp/w/your-workspace/sse?token=YOUR_PROD_TOKEN"
    }
  }
}
```

## Next Steps

1. ✅ MCP configured for local development
2. ⬜ Test MCP integration with Claude Code
3. ⬜ Create production workspace in Windmill Cloud
4. ⬜ Set up separate dev/staging/prod tokens
5. ⬜ Add MCP token management to deployment docs

## Resources

- [Windmill MCP Documentation](https://www.windmill.dev/docs/core_concepts/mcp)
- [Model Context Protocol Spec](https://modelcontextprotocol.io/specification/2025-06-18)
- [Windmill API Reference](https://app.windmill.dev/openapi.html)

## Changelog

**2025-12-22**: Initial setup
- Created MCP token for blueprint workspace
- Configured `.mcp.json` for local development
- Documented available capabilities and usage
