import pool from './database';

export async function initializeDatabase() {
  try {
    console.log('🚀 Checking and initializing database schema...');
    
    // Create migrations table for tracking schema version
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(50) PRIMARY KEY,
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Check if tokens table migration has been applied
    const migrationCheck = await pool.query(
      'SELECT version FROM schema_migrations WHERE version = $1', 
      ['001_create_tokens_table']
    );
    
    if (migrationCheck.rows.length === 0) {
      console.log('📝 Applying tokens table migration...');
      
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
      
      // Mark migration as applied
      await pool.query(
        'INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT (version) DO NOTHING',
        ['001_create_tokens_table']
      );
      
      console.log('✅ Tokens table migration applied');
    } else {
      console.log('✅ Tokens table already exists');
    }
    
    // Check if indexes migration has been applied
    const indexMigrationCheck = await pool.query(
      'SELECT version FROM schema_migrations WHERE version = $1', 
      ['002_create_indexes']
    );
    
    if (indexMigrationCheck.rows.length === 0) {
      console.log('📝 Applying indexes migration...');
      
      // Create indexes
      await pool.query('CREATE INDEX IF NOT EXISTS idx_tokens_creator ON tokens(creator)');
      await pool.query('CREATE INDEX IF NOT EXISTS idx_tokens_created_at ON tokens(created_at DESC)');
      
      // Mark migration as applied
      await pool.query(
        'INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT (version) DO NOTHING',
        ['002_create_indexes']
      );
      
      console.log('✅ Indexes migration applied');
    } else {
      console.log('✅ Indexes already exist');
    }
    
    // Check if sample data migration has been applied OR if data already exists
    const sampleDataCheck = await pool.query(
      'SELECT version FROM schema_migrations WHERE version = $1', 
      ['003_insert_sample_data']
    );
    
    const existingTokensCheck = await pool.query('SELECT COUNT(*) FROM tokens WHERE symbol IN ($1, $2, $3)', ['BTCS', 'ETHS', 'TOKEN']);
    const existingTokenCount = parseInt(existingTokensCheck.rows[0].count);
    
    if (sampleDataCheck.rows.length === 0 && existingTokenCount === 0) {
      console.log('📝 Applying sample data migration...');
      
      // Insert sample data with conflict handling
      await pool.query(`
        INSERT INTO tokens (name, symbol, total_supply, creator) VALUES 
          ($1, $2, $3, $4),
          ($5, $6, $7, $8),
          ($9, $10, $11, $12)
        ON CONFLICT (symbol) DO NOTHING
      `, [
        'Bitcoin Sample', 'BTCS', '21000000000000000000000000', '0x1234567890123456789012345678901234567890',
        'Ethereum Sample', 'ETHS', '1000000000000000000000000000', '0x2345678901234567890123456789012345678901',
        'Tokenization Coin', 'TOKEN', '100000000000000000000000000', '0x3456789012345678901234567890123456789012'
      ]);
      
      // Mark migration as applied
      await pool.query(
        'INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT (version) DO NOTHING',
        ['003_insert_sample_data']
      );
      
      console.log('✅ Sample data migration applied');
    } else {
      if (existingTokenCount > 0) {
        console.log(`✅ Sample data already exists (${existingTokenCount} tokens found)`);
      } else {
        console.log('✅ Sample data migration already marked as applied');
      }
      
      // Make sure migration is marked as applied
      await pool.query(
        'INSERT INTO schema_migrations (version) VALUES ($1) ON CONFLICT (version) DO NOTHING',
        ['003_insert_sample_data']
      );
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