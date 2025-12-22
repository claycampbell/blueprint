# Windmill Platform - Licensing and Configuration Guide

## Overview

This project uses **Windmill Community Edition (CE)** which is free and has **no expiration**. If you see any expiration messages, they are likely referring to Enterprise Edition (EE) trial features, not the core platform functionality.

## Community Edition vs Enterprise Edition

### Community Edition (What We Use)
- **License**: Free forever, no expiration
- **Image**: `ghcr.io/windmill-labs/windmill:main`
- **Features**:
  - ✅ Unlimited workflows and scripts
  - ✅ All core automation features
  - ✅ REST API access
  - ✅ PostgreSQL backend
  - ✅ Docker-based workers
  - ✅ Webhook triggers
  - ✅ Scheduled jobs (cron)
  - ✅ Email notifications
  - ✅ Basic authentication

### Enterprise Edition (Not Required)
- **License**: Paid subscription
- **Image**: `ghcr.io/windmill-labs/windmill-ee:main`
- **Additional Features**:
  - SAML/OIDC SSO
  - Advanced audit logs
  - Priority support
  - Custom branding
  - Advanced permissions

## Handling "Expiration" Messages

If you see messages about expiration or trial ending, these refer to EE features that were temporarily available. **The core platform continues to work indefinitely**.

### Quick Fix

Run the reset script to clear any EE trial remnants:

```bash
# On Linux/Mac:
cd starter-kit
./reset-windmill.sh

# On Windows:
cd starter-kit
reset-windmill.bat
```

This will:
1. Stop Windmill services
2. Clear the Windmill database
3. Remove cached data
4. Restart with CE defaults

### Manual Configuration

If you prefer to configure manually, ensure these environment variables are set in `docker-compose.yml`:

```yaml
windmill-server:
  image: ghcr.io/windmill-labs/windmill:main  # CE image
  environment:
    - MODE=server
    - DISABLE_NSJAIL=true  # For dev environments
    - INSTANCE_NAME=Blueprint Connect 2.0 Dev
```

## Verifying Your Installation

To verify you're running the Community Edition:

1. **Check Docker image**:
   ```bash
   docker ps | grep windmill
   ```
   Should show: `ghcr.io/windmill-labs/windmill:main`

2. **Check Windmill UI**:
   - Navigate to http://localhost:8000
   - Login (admin@windmill.dev / changeme)
   - Go to Settings → About
   - Should show "Community Edition"

3. **Check available features**:
   - Core features work without restrictions
   - Some menu items may show lock icons (EE features)
   - Ignore locked features - all necessary functionality is available

## Common Issues and Solutions

### Issue: "Trial Expired" Banner
**Solution**: This refers to EE trial features. Core CE features still work. Run reset script if banner is bothersome.

### Issue: Cannot access certain settings
**Solution**: Those are EE-only settings. Use CE alternatives:
- Instead of SAML → Use basic auth
- Instead of audit logs → Use PostgreSQL logs
- Instead of custom branding → Use as-is

### Issue: Worker not executing jobs
**Solution**: Check worker configuration:
```bash
docker-compose logs windmill-worker
```

Ensure `DISABLE_NSJAIL=true` is set for development environments.

### Issue: Database connection errors
**Solution**: Ensure PostgreSQL is running and healthy:
```bash
docker-compose ps postgres
docker-compose exec postgres pg_isready -U blueprint
```

## Best Practices

1. **Stay on CE**: Unless you specifically need EE features, stick with the Community Edition
2. **Regular Updates**: Pull latest CE image periodically for security and bug fixes
3. **Backup Workflows**: Export your workflows regularly as JSON
4. **Monitor Resources**: CE has no artificial limits, but monitor system resources

## Resources

- **Windmill Documentation**: https://windmill.dev/docs
- **Community Forum**: https://github.com/windmill-labs/windmill/discussions
- **Issue Tracker**: https://github.com/windmill-labs/windmill/issues
- **License Details**: https://github.com/windmill-labs/windmill/blob/main/LICENSE

## Summary

**You do not need to worry about expiration with Windmill Community Edition**. Any expiration messages refer to optional Enterprise features. The core automation platform that Blueprint Connect 2.0 relies on is free and will continue working indefinitely.

If you encounter any licensing-related issues, run the reset script first. If problems persist, check this guide or consult the Windmill community forums.