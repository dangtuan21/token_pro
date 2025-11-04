export interface Token {
  id: string;
  name: string;
  symbol: string;
  totalSupply: string;
  createdAt: string;
  creator: string;
}

export interface AddTokenInput {
  name: string;
  symbol: string;
  totalSupply: string;
  creator: string;
}