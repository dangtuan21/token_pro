import type { Token } from './types';

interface TokenCardProps {
  token: Token;
}

export function TokenCard({ token }: TokenCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="token-card">
      <div className="token-card-header">
        <div>
          <h3 className="token-card-title">{token.name}</h3>
          <p className="token-card-symbol">{token.symbol}</p>
        </div>
        <span className="token-card-badge">
          #{token.id}
        </span>
      </div>
      
      <div className="token-card-details">
        <div className="token-card-detail-row">
          <span>Total Supply:</span>
          <span className="token-card-detail-value">{Number(token.totalSupply).toLocaleString()}</span>
        </div>
        <div className="token-card-detail-row">
          <span>Creator:</span>
          <span className="token-card-detail-value">{token.creator}</span>
        </div>
        <div className="token-card-detail-row">
          <span>Created:</span>
          <span className="token-card-detail-value">{formatDate(token.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}