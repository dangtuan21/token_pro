-- Database initialization script for tokenization app
-- Run this to create the tokens table in your RDS database

CREATE TABLE IF NOT EXISTS tokens (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    total_supply BIGINT NOT NULL,
    creator VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on creator for faster queries
CREATE INDEX IF NOT EXISTS idx_tokens_creator ON tokens(creator);

-- Insert a sample token for testing
INSERT INTO tokens (name, symbol, total_supply, creator) 
VALUES ('Sample Token', 'SAMPLE', 1000000, '0x742d35Cc6634C0532925a3b8D8C4B4A8B7e1d5A5')
ON CONFLICT DO NOTHING;