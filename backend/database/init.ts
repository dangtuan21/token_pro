import { Pool } from 'pg';

const pool = new Pool({
  host: 'tokenization-database.cpvsc3suhxxo.us-east-1.rds.amazonaws.com',
  user: 'tokenuser',
  password: 'TempPassword123!',
  database: 'tokendb',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database schema...');
    
    // Create tokens table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tokens (
        id BIGSERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        symbol VARCHAR(10) NOT NULL UNIQUE,
        total_supply NUMERIC(78, 0) NOT NULL,
        creator VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tokens_creator ON tokens(creator)');
    await pool.query('CREATE INDEX IF NOT EXISTS idx_tokens_created_at ON tokens(created_at DESC)');
    
    console.log('✅ Tables and indexes created');
    
    // Insert sample data
    await pool.query(`
      INSERT INTO tokens (name, symbol, total_supply, creator) VALUES 
        ('Bitcoin Sample', 'BTCS', '21000000000000000000000000', '0x1234567890123456789012345678901234567890'),
        ('Ethereum Sample', 'ETHS', '1000000000000000000000000000', '0x2345678901234567890123456789012345678901'),
        ('Tokenization Coin', 'TOKEN', '100000000000000000000000000', '0x3456789012345678901234567890123456789012')
      ON CONFLICT (symbol) DO NOTHING
    `);
    
    console.log('✅ Sample data inserted');
    
    // Verify data
    const result = await pool.query('SELECT id, name, symbol, creator FROM tokens ORDER BY created_at DESC');
    console.log('📊 Current tokens in database:');
    console.log(result.rows);
    
    await pool.end();
    console.log('✅ Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();