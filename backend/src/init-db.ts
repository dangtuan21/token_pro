import pool from './database';

export async function initializeDatabase() {
  try {
    console.log('🚀 Checking and initializing database schema...');
    
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
    
    console.log('✅ Tables and indexes ensured');
    
    // Check if we have any data
    const countResult = await pool.query('SELECT COUNT(*) FROM tokens');
    const tokenCount = parseInt(countResult.rows[0].count);
    
    if (tokenCount === 0) {
      console.log('📝 Inserting sample data...');
      
      // Insert sample data
      await pool.query(`
        INSERT INTO tokens (name, symbol, total_supply, creator) VALUES 
          ($1, $2, $3, $4),
          ($5, $6, $7, $8),
          ($9, $10, $11, $12)
      `, [
        'Bitcoin Sample', 'BTCS', '21000000000000000000000000', '0x1234567890123456789012345678901234567890',
        'Ethereum Sample', 'ETHS', '1000000000000000000000000000', '0x2345678901234567890123456789012345678901',
        'Tokenization Coin', 'TOKEN', '100000000000000000000000000', '0x3456789012345678901234567890123456789012'
      ]);
      
      console.log('✅ Sample data inserted');
    } else {
      console.log(`📊 Database already has ${tokenCount} tokens`);
    }
    
    // Verify data
    const result = await pool.query('SELECT id, name, symbol, creator FROM tokens ORDER BY created_at DESC LIMIT 5');
    console.log('📊 Recent tokens in database:');
    console.log(result.rows);
    
    console.log('✅ Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
}