import { Pool } from 'pg';

// Environment-based database configuration
const environment = process.env.NODE_ENV || 'development';

// Parse DATABASE_URL or use individual environment variables
let dbConfig;

if (process.env.DATABASE_URL) {
  // Use DATABASE_URL (preferred for production/CI)
  dbConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for RDS connections
    },
    // Connection pool settings
    max: 20, // Maximum number of clients in pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  };
} else {
  // Use individual environment variables (for local development)
  dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '5432'),
    ssl: {
      rejectUnauthorized: false // Required for RDS connections
    },
    // Connection pool settings
    max: 20, // Maximum number of clients in pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
  };
}

// Validate required environment variables
if (!process.env.DATABASE_URL) {
  const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`❌ Missing required environment variable: ${envVar}`);
      console.error(`💡 Either provide DATABASE_URL or all individual DB_* variables`);
      process.exit(1);
    }
  }
}

const pool = new Pool(dbConfig);

// Test the connection
pool.on('connect', () => {
  console.log(`✅ Connected to PostgreSQL database (${environment})`);
  console.log(`📊 Database: ${dbConfig.database} on ${dbConfig.host}`);
});

pool.on('error', (err) => {
  console.error('❌ Unexpected error on idle client', err);
  process.exit(-1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('🔄 Gracefully shutting down database connection...');
  await pool.end();
  process.exit(0);
});

export default pool;