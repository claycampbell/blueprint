/**
 * Environment Variable Validation
 * Ensures all required environment variables are properly configured before starting the application
 */

/**
 * Required environment variables for database connection
 */
const REQUIRED_ENV_VARS = [
  'DB_HOST',
  'DB_PORT',
  'DB_NAME',
  'DB_USER',
  'DB_PASSWORD',
  'DB_SCHEMA'
];

/**
 * Validate that all required environment variables are set
 * @throws {Error} If any required variables are missing or invalid
 */
export function validateEnvironment(): void {
  console.log('[ENV VALIDATION] Checking environment configuration...');

  // Check for missing required variables
  const missing = REQUIRED_ENV_VARS.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error(`
[FATAL] ENVIRONMENT CONFIGURATION ERROR

Missing required environment variables:
${missing.map(key => `  - ${key}`).join('\n')}

Please create a .env file in the project root with these variables.
See .env.example for reference.

Example:
  DB_HOST=localhost
  DB_PORT=5432
  DB_NAME=connect2_dev
  DB_USER=connect_user
  DB_PASSWORD=your_password_here
  DB_SCHEMA=connect2
    `);
    process.exit(1);
  }

  // Validate DB_PORT is a valid number
  const port = parseInt(process.env.DB_PORT!, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    console.error(`
[FATAL] INVALID CONFIGURATION

DB_PORT must be a valid port number (1-65535)
Current value: ${process.env.DB_PORT}
    `);
    process.exit(1);
  }

  // Validate pool size if provided
  if (process.env.DB_POOL_MAX) {
    const poolMax = parseInt(process.env.DB_POOL_MAX, 10);
    if (isNaN(poolMax) || poolMax < 1) {
      console.error(`
[FATAL] INVALID CONFIGURATION

DB_POOL_MAX must be a positive number
Current value: ${process.env.DB_POOL_MAX}
      `);
      process.exit(1);
    }
  }

  // Warn about suspicious configurations in production
  if (process.env.NODE_ENV === 'production') {
    const warnings: string[] = [];

    if (process.env.DB_HOST === 'localhost' || process.env.DB_HOST === '127.0.0.1') {
      warnings.push('Production environment using localhost database - this is usually incorrect');
    }

    if (process.env.DB_PASSWORD === 'connect_dev_password' || process.env.DB_PASSWORD === 'password') {
      console.error(`
[FATAL] SECURITY ERROR

Production environment using default or weak development password.
This is a critical security vulnerability.

Please set a strong password in the DB_PASSWORD environment variable.
      `);
      process.exit(1);
    }

    if (process.env.DB_NAME?.includes('dev') || process.env.DB_NAME?.includes('test')) {
      warnings.push(`Production environment using database name "${process.env.DB_NAME}" - this looks like a dev/test database`);
    }

    if (warnings.length > 0) {
      console.warn(`
[WARNING] SUSPICIOUS PRODUCTION CONFIGURATION

${warnings.map(w => `  ⚠️  ${w}`).join('\n')}

Please verify your environment configuration is correct for production.
      `);

      // In production, treat warnings as errors for safety
      console.error('[FATAL] Cannot start with suspicious production configuration');
      process.exit(1);
    }
  }

  console.log('[ENV VALIDATION] ✅ Environment configuration validated successfully');
  console.log(`[ENV VALIDATION] Database: ${process.env.DB_USER}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`);
  console.log(`[ENV VALIDATION] Schema: ${process.env.DB_SCHEMA}`);
  console.log(`[ENV VALIDATION] Environment: ${process.env.NODE_ENV || 'development'}`);
}

export default validateEnvironment;
