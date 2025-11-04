import { GraphQLClient } from 'graphql-request';

// API Gateway endpoint - will be updated after deployment
const getGraphQLEndpoint = () => {
  if (process.env.NODE_ENV === 'production') {
    // This will be populated by the CI/CD pipeline from CloudFormation outputs
    return process.env.REACT_APP_GRAPHQL_ENDPOINT || 'https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/production/graphql';
  }
  // Local development
  return 'http://localhost:3010/graphql';
};

const client = new GraphQLClient(getGraphQLEndpoint(), {
  headers: {
    'Content-Type': 'application/json',
  },
});

export const GET_ALL_TOKENS = `
  query GetAllTokens {
    getAllTokens {
      id
      name
      symbol
      totalSupply
      createdAt
      creator
    }
  }
`;

export const GET_TOKENS_BY_CREATOR = `
  query GetTokensByCreator($creator: String!) {
    getTokensByCreator(creator: $creator) {
      id
      name
      symbol
      totalSupply
      createdAt
      creator
    }
  }
`;

export const ADD_TOKEN = `
  mutation AddToken($input: AddTokenInput!) {
    addToken(input: $input) {
      id
      name
      symbol
      totalSupply
      createdAt
      creator
    }
  }
`;

export const graphqlClient = client;