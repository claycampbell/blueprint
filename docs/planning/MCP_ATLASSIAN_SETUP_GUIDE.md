# Atlassian MCP Server Setup Guide (Docker-based)

## Overview

This guide walks through setting up the **sooperset/mcp-atlassian** MCP server, which provides a more stable alternative to the standard Atlassian MCP using Docker containers and API token authentication instead of OAuth.

**Repository:** https://github.com/sooperset/mcp-atlassian

## Why This MCP Server?

**Benefits over standard Atlassian MCP:**
- ✅ **API Token Authentication** - More stable than OAuth (no token expiration after inactivity)
- ✅ **Docker-based** - Containerized deployment for consistent environment
- ✅ **Same Functionality** - Full Jira and Confluence support
- ✅ **Better Reliability** - Fewer 401 Unauthorized errors

## Prerequisites

### 1. Docker Installation
You must have Docker installed and running:

```bash
# Verify Docker is installed
docker --version

# If not installed, download from:
# https://www.docker.com/products/docker-desktop
```

### 2. Atlassian API Tokens

You'll need to generate API tokens for Jira and Confluence:

**Generate API Tokens:**
1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
2. Click "Create API token"
3. Give it a name (e.g., "Claude Code MCP")
4. Copy the token immediately (you won't be able to see it again)
5. Generate separate tokens for Jira and Confluence if desired, or use the same token

**Find Your Atlassian URLs:**
- **Jira URL:** https://your-company.atlassian.net
- **Confluence URL:** https://your-company.atlassian.net/wiki

## Setup Instructions

### Step 1: Pull the Docker Image

```bash
docker pull ghcr.io/sooperset/mcp-atlassian:latest
```

### Step 2: Configure Claude Code

You need to update your `.claude.json` configuration file to use this MCP server.

**Location:** `C:\Users\ClayCampbell\.claude.json`

**Find the blueprint project section** (lines 273-290 in current config) and **replace** the existing `mcpServers` configuration:

**Current (Standard Atlassian MCP - OAuth-based):**
```json
"C:\\Users\\ClayCampbell\\Documents\\GitHub\\blueprint": {
  "allowedTools": [],
  "mcpContextUris": [],
  "mcpServers": {
    "atlassian": {
      "type": "sse",
      "url": "https://mcp.atlassian.com/v1/sse"
    }
  },
  ...
}
```

**Replace with (Docker-based sooperset MCP):**
```json
"C:\\Users\\ClayCampbell\\Documents\\GitHub\\blueprint": {
  "allowedTools": [],
  "mcpContextUris": [],
  "mcpServers": {
    "atlassian": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e", "JIRA_URL",
        "-e", "JIRA_USERNAME",
        "-e", "JIRA_API_TOKEN",
        "-e", "CONFLUENCE_URL",
        "-e", "CONFLUENCE_USERNAME",
        "-e", "CONFLUENCE_API_TOKEN",
        "ghcr.io/sooperset/mcp-atlassian:latest"
      ],
      "env": {
        "JIRA_URL": "https://your-company.atlassian.net",
        "JIRA_USERNAME": "your.email@company.com",
        "JIRA_API_TOKEN": "your_jira_api_token_here",
        "CONFLUENCE_URL": "https://your-company.atlassian.net/wiki",
        "CONFLUENCE_USERNAME": "your.email@company.com",
        "CONFLUENCE_API_TOKEN": "your_confluence_api_token_here"
      }
    }
  },
  ...
}
```

### Step 3: Fill in Your Credentials

Replace the following placeholders in the configuration:

| Placeholder | Replace With | Example |
|-------------|--------------|---------|
| `your-company.atlassian.net` | Your Atlassian domain | `blueprint.atlassian.net` |
| `your.email@company.com` | Your Atlassian email | `claycampbell@gmail.com` |
| `your_jira_api_token_here` | API token from Step 2 | `ATATT3xFfGF0...` |
| `your_confluence_api_token_here` | API token from Step 2 | `ATATT3xFfGF0...` (can be same) |

**Security Note:** The `.claude.json` file should **NOT** be committed to Git. It's already in your global gitignore, but verify with:

```bash
git check-ignore C:\Users\ClayCampbell\.claude.json
# Should output the path, meaning it's ignored
```

### Step 4: Restart Claude Code

After updating the configuration:

1. Exit your current Claude Code session (if running)
2. Navigate to the blueprint directory
3. Launch Claude Code:

```bash
cd C:\Users\ClayCampbell\Documents\GitHub\blueprint
claude
```

### Step 5: Verify MCP Connection

Test the MCP connection in Claude Code:

```bash
# In Claude Code, try these commands:
/mcp                          # List all MCP servers
/mcp test atlassian          # Test the connection (if available)
```

Or ask Claude directly:
```
Can you list all the Jira projects I have access to?
```

## Configuration Options

### Optional Environment Variables

You can add these to the `env` section for additional configuration:

**Filtering (Recommended for Performance):**
```json
"env": {
  "JIRA_URL": "https://your-company.atlassian.net",
  "JIRA_USERNAME": "your.email@company.com",
  "JIRA_API_TOKEN": "your_token",
  "JIRA_PROJECTS_FILTER": "DP,BLUEPRINT",  // Only load these projects
  "CONFLUENCE_URL": "https://your-company.atlassian.net/wiki",
  "CONFLUENCE_USERNAME": "your.email@company.com",
  "CONFLUENCE_API_TOKEN": "your_token",
  "CONFLUENCE_SPACES_FILTER": "DP,DOCS",   // Only load these spaces
  "READ_ONLY_MODE": "false"                // Set to "true" to disable writes
}
```

**SSL Verification (for self-hosted Atlassian):**
```json
"JIRA_SSL_VERIFY": "false",        // Only if using self-signed certificates
"CONFLUENCE_SSL_VERIFY": "false"
```

## Troubleshooting

### Docker Not Found
**Error:** `command not found: docker`

**Solution:**
1. Install Docker Desktop from https://www.docker.com/products/docker-desktop
2. Ensure Docker Desktop is running
3. Verify: `docker --version`

### Authentication Failed (401)
**Error:** `Authentication failed: 401`

**Solutions:**
1. **Verify API token** - Generate a new one if unsure
2. **Check email address** - Must match your Atlassian account
3. **Verify URLs** - Ensure correct domain and `/wiki` suffix for Confluence

### Connection Timeout
**Error:** MCP server connection timeout

**Solutions:**
1. **Pull the image first:** `docker pull ghcr.io/sooperset/mcp-atlassian:latest`
2. **Check Docker is running:** `docker ps`
3. **Check network connectivity:** Can you access Atlassian URLs in browser?

### Tool Not Available
**Error:** Jira tools not showing up in Claude Code

**Solutions:**
1. **Restart Claude Code** after config changes
2. **Check project path** - Ensure you're in the correct directory
3. **Check configuration** - Run `/mcp` to see if server is loaded

## Comparison: Standard vs sooperset MCP

| Feature | Standard Atlassian MCP | sooperset MCP (This Guide) |
|---------|----------------------|---------------------------|
| Transport | SSE (Server-Sent Events) | Docker stdin/stdout |
| Authentication | OAuth 2.0 | API Token |
| Token Expiration | Yes (after inactivity) | No (tokens are long-lived) |
| Setup Complexity | Lower (no Docker) | Higher (requires Docker) |
| Reliability | Lower (401 errors) | Higher (stable tokens) |
| Performance | Similar | Similar |
| Features | Full Jira/Confluence | Full Jira/Confluence |

## Next Steps

Once the MCP server is configured and working:

1. **Test basic operations:**
   - List Jira projects
   - Search for issues
   - Create a test issue

2. **Run the bulk task creation:**
   - Use the MCP tools to create all 74 tasks from the epic tasking guide
   - Or fall back to the Python script if MCP approach doesn't work

3. **Document which approach works best:**
   - If MCP is stable, update project documentation to recommend it
   - If issues persist, document the Python script as the preferred method

## Additional Resources

- **GitHub Repository:** https://github.com/sooperset/mcp-atlassian
- **Docker Documentation:** https://docs.docker.com/get-started/
- **Atlassian API Tokens:** https://id.atlassian.com/manage-profile/security/api-tokens
- **Claude Code MCP Docs:** https://code.claude.com/docs/en/mcp
