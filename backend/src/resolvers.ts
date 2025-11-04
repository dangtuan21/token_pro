import type { Token, AddTokenInput } from './types';
import pool from './database';

export const resolvers = {
  Query: {
    getAllTokens: async (): Promise<Token[]> => {
      try {
        const result = await pool.query(
          'SELECT id, name, symbol, total_supply, creator, created_at FROM tokens ORDER BY created_at DESC'
        );
        
        return result.rows.map(row => ({
          id: row.id.toString(),
          name: row.name,
          symbol: row.symbol,
          totalSupply: row.total_supply.toString(),
          creator: row.creator,
          createdAt: row.created_at.toISOString()
        }));
      } catch (error) {
        console.error('Error fetching tokens:', error);
        throw new Error('Failed to fetch tokens');
      }
    },
    
    getTokensByCreator: async (_: any, { creator }: { creator: string }): Promise<Token[]> => {
      try {
        const result = await pool.query(
          'SELECT id, name, symbol, total_supply, creator, created_at FROM tokens WHERE LOWER(creator) = LOWER($1) ORDER BY created_at DESC',
          [creator]
        );
        
        return result.rows.map(row => ({
          id: row.id.toString(),
          name: row.name,
          symbol: row.symbol,
          totalSupply: row.total_supply.toString(),
          creator: row.creator,
          createdAt: row.created_at.toISOString()
        }));
      } catch (error) {
        console.error('Error fetching tokens by creator:', error);
        throw new Error('Failed to fetch tokens by creator');
      }
    }
  },

  Mutation: {
    addToken: async (_: any, { input }: { input: AddTokenInput }): Promise<Token> => {
      try {
        const result = await pool.query(
          'INSERT INTO tokens (name, symbol, total_supply, creator) VALUES ($1, $2, $3, $4) RETURNING id, name, symbol, total_supply, creator, created_at',
          [input.name, input.symbol.toUpperCase(), input.totalSupply, input.creator]
        );
        
        const row = result.rows[0];
        return {
          id: row.id.toString(),
          name: row.name,
          symbol: row.symbol,
          totalSupply: row.total_supply.toString(),
          creator: row.creator,
          createdAt: row.created_at.toISOString()
        };
      } catch (error: any) {
        console.error('Error adding token:', error);
        if (error.code === '23505') { // unique_violation
          throw new Error('Token symbol already exists');
        }
        throw new Error('Failed to add token');
      }
    }
  }
};