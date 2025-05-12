import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Database connection configuration
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

// Create a connection pool
const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // For development only, use proper SSL in production
  }
});

// Create Drizzle instance
export const db = drizzle(pool);

export { pool };
