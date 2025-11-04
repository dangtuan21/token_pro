export const typeDefs = `
  type Token {
    id: ID!
    name: String!
    symbol: String!
    totalSupply: String!
    createdAt: String!
    creator: String!
  }

  input AddTokenInput {
    name: String!
    symbol: String!
    totalSupply: String!
    creator: String!
  }

  type Query {
    getAllTokens: [Token!]!
    getTokensByCreator(creator: String!): [Token!]!
  }

  type Mutation {
    addToken(input: AddTokenInput!): Token!
  }
`;