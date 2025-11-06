import { GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = 'http://tokenization-alb-934672107.us-east-1.elb.amazonaws.com/graphql';

const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
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
