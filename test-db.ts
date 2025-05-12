import { pool } from './server/db.js';

async function testDatabaseConnection() {
  const client = await pool.connect();
  try {
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    console.log('Current database time:', result.rows[0].now);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  } finally {
    client.release();
    // Close the pool to allow the script to exit
    await pool.end();
  }
}

testDatabaseConnection().catch(console.error);
