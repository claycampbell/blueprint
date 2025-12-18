/**
 * Runtime test for TypeORM entities
 * Tests that all entities can be loaded without duplicate column errors
 */

require('reflect-metadata');
require('ts-node/register'); // Enable TypeScript loading
const { DataSource } = require('typeorm');
const path = require('path');

async function testEntities() {
  console.log('🔍 Testing TypeORM Entity Configuration...\n');

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'connect2_dev',
    schema: process.env.DB_SCHEMA || 'connect2',
    entities: [path.join(__dirname, 'src/entities/**/*.entity.ts')],
    synchronize: false,
    logging: false
  });

  try {
    console.log('📦 Initializing DataSource to load entity metadata...');

    // Initialize to build entity metadata (doesn't require DB connection)
    await dataSource.buildMetadatas();

    const entityMetadatas = dataSource.entityMetadatas;

    if (entityMetadatas && entityMetadatas.length > 0) {
      console.log(`✅ Successfully loaded ${entityMetadatas.length} entities:\n`);

      let hasErrors = false;
      entityMetadatas.forEach(meta => {
        const columns = meta.columns.map(c => c.databaseName);
        const duplicates = columns.filter((name, index) => columns.indexOf(name) !== index);

        if (duplicates.length > 0) {
          console.log(`   ✗ ${meta.name}: DUPLICATE COLUMNS: ${[...new Set(duplicates)].join(', ')}`);
          hasErrors = true;
        } else {
          console.log(`   ✓ ${meta.name} (${columns.length} columns)`);
        }
      });

      if (hasErrors) {
        console.log('\n❌ Some entities have duplicate column definitions!');
        return false;
      } else {
        console.log('\n✅ All entities validated successfully - no duplicate columns!');
        return true;
      }
    } else {
      console.log('⚠️  No entities found.');
      return false;
    }
  } catch (error) {
    console.error('❌ Error loading entities:', error.message);
    console.error(error.stack);
    return false;
  }
}

testEntities()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
