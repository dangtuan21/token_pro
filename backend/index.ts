import { Elysia } from 'elysia';
import { yoga } from '@elysiajs/graphql-yoga';
import { cors } from '@elysiajs/cors';
import { typeDefs } from './src/schema';
import { resolvers } from './src/resolvers';
import { initializeDatabase } from './src/init-db';

// Initialize database on startup
await initializeDatabase();

// Create Elysia app with GraphQL and CORS
const app = new Elysia()
  .use(cors({
    origin: '*',
    credentials: true,
  }))
  .use(yoga({
    typeDefs,
    resolvers,
    graphqlEndpoint: '/graphql',
  }))
  .get('/', () => 'Token API with Elysia + GraphQL + PostgreSQL! 🚀 [CI/CD TEST - Version 4.0-Database-Connected!]')
  .get('/api/hello/:name', ({ params: { name } }) => ({
    message: `Hello, ${name}!`,
    version: 'v1.1',
    timestamp: new Date().toISOString(),
    status: 'secrets-configured'
  }))
  .listen(3010);

console.log('🚀 Backend running at http://localhost:3010/');