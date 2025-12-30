// Test: Database connection limits and query performance
// This tests PostgreSQL integration capabilities

type QueryResult = {
  testName: string;
  success: boolean;
  rowCount?: number;
  duration: number;
  error?: string;
};

export async function main(pgClient: any): Promise<any> {
  console.log('Starting database stress test...');

  const results = {
    connectionTest: null as QueryResult | null,
    simpleQueryTest: null as QueryResult | null,
    bulkInsertTest: null as QueryResult | null,
    complexQueryTest: null as QueryResult | null,
    concurrentQueryTest: null as QueryResult | null,
    transactionTest: null as QueryResult | null,
    performance: {} as any,
    recommendations: [] as string[]
  };

  // Test 1: Basic connection
  console.log('Test 1: Testing database connection...');
  results.connectionTest = await testConnection(pgClient);

  // Test 2: Simple query performance
  console.log('Test 2: Testing simple query performance...');
  results.simpleQueryTest = await testSimpleQuery(pgClient);

  // Test 3: Bulk insert capability
  console.log('Test 3: Testing bulk insert...');
  results.bulkInsertTest = await testBulkInsert(pgClient);

  // Test 4: Complex query with joins
  console.log('Test 4: Testing complex query...');
  results.complexQueryTest = await testComplexQuery(pgClient);

  // Test 5: Concurrent queries
  console.log('Test 5: Testing concurrent queries...');
  results.concurrentQueryTest = await testConcurrentQueries(pgClient);

  // Test 6: Transaction handling
  console.log('Test 6: Testing transaction handling...');
  results.transactionTest = await testTransaction(pgClient);

  // Analyze performance
  results.performance = analyzePerformance(results);
  results.recommendations = generateDatabaseRecommendations(results);

  // Cleanup test data
  await cleanupTestData(pgClient);

  return results;
}

async function testConnection(pgClient: any): Promise<QueryResult> {
  const start = Date.now();
  try {
    const result = await pgClient.query('SELECT NOW() as current_time, version() as pg_version');
    return {
      testName: 'Connection Test',
      success: true,
      rowCount: result.rows.length,
      duration: Date.now() - start
    };
  } catch (error: any) {
    return {
      testName: 'Connection Test',
      success: false,
      duration: Date.now() - start,
      error: error.message
    };
  }
}

async function testSimpleQuery(pgClient: any): Promise<QueryResult> {
  const start = Date.now();
  try {
    // Create test table
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS windmill_test_simple (
        id SERIAL PRIMARY KEY,
        data TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert test data
    for (let i = 0; i < 100; i++) {
      await pgClient.query(
        'INSERT INTO windmill_test_simple (data) VALUES ($1)',
        [`Test data ${i}`]
      );
    }

    // Query test data
    const result = await pgClient.query('SELECT * FROM windmill_test_simple');

    return {
      testName: 'Simple Query Test',
      success: true,
      rowCount: result.rows.length,
      duration: Date.now() - start
    };
  } catch (error: any) {
    return {
      testName: 'Simple Query Test',
      success: false,
      duration: Date.now() - start,
      error: error.message
    };
  }
}

async function testBulkInsert(pgClient: any): Promise<QueryResult> {
  const start = Date.now();
  const recordCount = 10000;

  try {
    // Create test table
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS windmill_test_bulk (
        id SERIAL PRIMARY KEY,
        uuid UUID DEFAULT gen_random_uuid(),
        data JSONB,
        value NUMERIC,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Prepare bulk insert data
    const values = [];
    const placeholders = [];
    let paramCount = 1;

    for (let i = 0; i < recordCount; i++) {
      values.push(
        JSON.stringify({ index: i, random: Math.random() }),
        Math.random() * 1000
      );
      placeholders.push(`($${paramCount}, $${paramCount + 1})`);
      paramCount += 2;
    }

    // Execute bulk insert
    const query = `
      INSERT INTO windmill_test_bulk (data, value)
      VALUES ${placeholders.join(', ')}
      RETURNING id
    `;

    const result = await pgClient.query(query, values);

    return {
      testName: 'Bulk Insert Test',
      success: true,
      rowCount: result.rows.length,
      duration: Date.now() - start
    };
  } catch (error: any) {
    return {
      testName: 'Bulk Insert Test',
      success: false,
      duration: Date.now() - start,
      error: error.message
    };
  }
}

async function testComplexQuery(pgClient: any): Promise<QueryResult> {
  const start = Date.now();

  try {
    // Create related tables
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS windmill_test_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50),
        email VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS windmill_test_orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES windmill_test_users(id),
        total NUMERIC,
        status VARCHAR(20),
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);

    // Insert test data
    for (let i = 0; i < 100; i++) {
      const userResult = await pgClient.query(
        'INSERT INTO windmill_test_users (username, email) VALUES ($1, $2) RETURNING id',
        [`user${i}`, `user${i}@test.com`]
      );

      const userId = userResult.rows[0].id;

      for (let j = 0; j < 10; j++) {
        await pgClient.query(
          'INSERT INTO windmill_test_orders (user_id, total, status) VALUES ($1, $2, $3)',
          [userId, Math.random() * 1000, ['pending', 'completed', 'cancelled'][j % 3]]
        );
      }
    }

    // Execute complex query with joins, aggregations, and window functions
    const complexQuery = `
      WITH user_stats AS (
        SELECT
          u.id,
          u.username,
          COUNT(o.id) as order_count,
          SUM(o.total) as total_spent,
          AVG(o.total) as avg_order,
          MAX(o.total) as max_order,
          MIN(o.total) as min_order,
          RANK() OVER (ORDER BY SUM(o.total) DESC) as spending_rank
        FROM windmill_test_users u
        LEFT JOIN windmill_test_orders o ON u.id = o.user_id
        GROUP BY u.id, u.username
      )
      SELECT
        *,
        CASE
          WHEN spending_rank <= 10 THEN 'Top Spender'
          WHEN spending_rank <= 50 THEN 'Regular'
          ELSE 'Occasional'
        END as customer_tier
      FROM user_stats
      ORDER BY spending_rank
      LIMIT 100
    `;

    const result = await pgClient.query(complexQuery);

    return {
      testName: 'Complex Query Test',
      success: true,
      rowCount: result.rows.length,
      duration: Date.now() - start
    };
  } catch (error: any) {
    return {
      testName: 'Complex Query Test',
      success: false,
      duration: Date.now() - start,
      error: error.message
    };
  }
}

async function testConcurrentQueries(pgClient: any): Promise<QueryResult> {
  const start = Date.now();
  const concurrentCount = 50;

  try {
    const promises = [];

    for (let i = 0; i < concurrentCount; i++) {
      promises.push(
        pgClient.query('SELECT pg_sleep(0.1), $1 as query_id', [i])
      );
    }

    const results = await Promise.allSettled(promises);
    const successful = results.filter(r => r.status === 'fulfilled').length;

    return {
      testName: 'Concurrent Query Test',
      success: successful === concurrentCount,
      rowCount: successful,
      duration: Date.now() - start
    };
  } catch (error: any) {
    return {
      testName: 'Concurrent Query Test',
      success: false,
      duration: Date.now() - start,
      error: error.message
    };
  }
}

async function testTransaction(pgClient: any): Promise<QueryResult> {
  const start = Date.now();

  try {
    await pgClient.query('BEGIN');

    // Multiple operations in transaction
    await pgClient.query(`
      CREATE TABLE IF NOT EXISTS windmill_test_transaction (
        id SERIAL PRIMARY KEY,
        value INTEGER NOT NULL,
        CONSTRAINT positive_value CHECK (value > 0)
      )
    `);

    await pgClient.query('INSERT INTO windmill_test_transaction (value) VALUES ($1)', [100]);
    await pgClient.query('INSERT INTO windmill_test_transaction (value) VALUES ($1)', [200]);

    // This should fail the constraint
    try {
      await pgClient.query('INSERT INTO windmill_test_transaction (value) VALUES ($1)', [-100]);
      await pgClient.query('COMMIT');
      return {
        testName: 'Transaction Test',
        success: false,
        duration: Date.now() - start,
        error: 'Transaction should have failed but did not'
      };
    } catch (error) {
      // Rollback as expected
      await pgClient.query('ROLLBACK');

      // Verify rollback worked
      const result = await pgClient.query(
        'SELECT COUNT(*) as count FROM windmill_test_transaction'
      );

      return {
        testName: 'Transaction Test',
        success: result.rows[0].count === '0',
        duration: Date.now() - start
      };
    }
  } catch (error: any) {
    return {
      testName: 'Transaction Test',
      success: false,
      duration: Date.now() - start,
      error: error.message
    };
  }
}

async function cleanupTestData(pgClient: any): Promise<void> {
  const tables = [
    'windmill_test_simple',
    'windmill_test_bulk',
    'windmill_test_orders',
    'windmill_test_users',
    'windmill_test_transaction'
  ];

  for (const table of tables) {
    try {
      await pgClient.query(`DROP TABLE IF EXISTS ${table} CASCADE`);
    } catch (error) {
      console.error(`Failed to drop table ${table}:`, error);
    }
  }
}

function analyzePerformance(results: any): any {
  const performance = {
    connectionLatency: results.connectionTest?.duration || 0,
    simpleQuerySpeed: results.simpleQueryTest?.duration || 0,
    bulkInsertRate: 0,
    complexQuerySpeed: results.complexQueryTest?.duration || 0,
    concurrentCapacity: results.concurrentQueryTest?.rowCount || 0,
    transactionSupport: results.transactionTest?.success || false
  };

  if (results.bulkInsertTest?.success && results.bulkInsertTest.rowCount) {
    performance.bulkInsertRate = Math.round(
      (results.bulkInsertTest.rowCount / results.bulkInsertTest.duration) * 1000
    );
  }

  return performance;
}

function generateDatabaseRecommendations(results: any): string[] {
  const recommendations = [];

  // Connection recommendations
  if (results.connectionTest?.duration > 1000) {
    recommendations.push('⚠️ High connection latency. Check network configuration.');
  } else {
    recommendations.push('✅ Database connection is fast.');
  }

  // Bulk insert recommendations
  if (results.performance.bulkInsertRate < 1000) {
    recommendations.push('⚠️ Bulk insert performance is low. Consider using COPY command.');
  } else {
    recommendations.push('✅ Bulk insert performance is good.');
  }

  // Concurrent query recommendations
  if (results.concurrentQueryTest?.rowCount < 50) {
    recommendations.push('⚠️ Limited concurrent query capacity. May need connection pooling.');
  } else {
    recommendations.push('✅ Good concurrent query handling.');
  }

  // Transaction recommendations
  if (!results.transactionTest?.success) {
    recommendations.push('❌ Transaction handling issues detected.');
  } else {
    recommendations.push('✅ Transaction rollback works correctly.');
  }

  recommendations.push('💡 Use connection pooling for production.');
  recommendations.push('💡 Implement query caching for frequently accessed data.');
  recommendations.push('💡 Consider read replicas for scaling read operations.');

  return recommendations;
}