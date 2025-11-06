import { GraphQLClient } from 'graphql-request';

const GRAPHQL_ENDPOINT = 'http://54.173.148.56:3010/graphql';

const graphQLClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    'Content-Type': 'application/json',
  },
});

export { graphQLClient };

export const TOKENS_QUERY = `
  query {
    tokens {
      id
      name
      symbol
      description
    }
  }
`;
