-- Tokenization Database Schema
-- This file contains the table definitions for the tokenization application

-- Create tokens table
CREATE TABLE IF NOT EXISTS tokens (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    symbol VARCHAR(10) NOT NULL UNIQUE,
    total_supply NUMERIC(78, 0) NOT NULL, -- Support very large numbers for token supply
    creator VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index on creator for faster queries
CREATE INDEX IF NOT EXISTS idx_tokens_creator ON tokens(creator);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_tokens_created_at ON tokens(created_at DESC);

-- Insert some sample data for testing
INSERT INTO tokens (name, symbol, total_supply, creator) VALUES 
    ('Bitcoin Sample', 'BTCS', '21000000000000000000000000', '0x1234567890123456789012345678901234567890'),
    ('Ethereum Sample', 'ETHS', '1000000000000000000000000000', '0x2345678901234567890123456789012345678901'),
    ('Tokenization Coin', 'TOKEN', '100000000000000000000000000', '0x3456789012345678901234567890123456789012')
ON CONFLICT (symbol) DO NOTHING;