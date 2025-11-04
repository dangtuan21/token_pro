import React, { useState, useEffect } from 'react';
import { graphqlClient, GET_ALL_TOKENS, ADD_TOKEN } from './graphql';
import { AddTokenModal } from './AddTokenModal';
import { TokenCard } from './TokenCard';
import type { Token, AddTokenInput } from './types';

export function TokenManager() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokens = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await graphqlClient.request(GET_ALL_TOKENS);
      setTokens(data.getAllTokens);
    } catch (err) {
      console.error('Failed to fetch tokens:', err);
      setError('Failed to load tokens. Please check if the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToken = async (tokenData: AddTokenInput) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      const data = await graphqlClient.request(ADD_TOKEN, { input: tokenData });
      
      // Add the new token to the list
      setTokens(prev => [...prev, data.addToken]);
      setIsModalOpen(false);
      
      // Show success message
      alert(`Token "${data.addToken.name}" created successfully!`);
    } catch (err) {
      console.error('Failed to create token:', err);
      setError('Failed to create token. Please try again.');
      alert('Failed to create token. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  if (isLoading && tokens.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading tokens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      <div className="header-container">
        <div>
          <h1 className="header-title">Token Manager</h1>
          <p className="header-subtitle">Manage and view all tokens</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary"
        >
          <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Token
        </button>
      </div>

      {error && (
        <div className="error-container">
          <div className="error-content">
            <svg className="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.081 14.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            {error}
          </div>
          <button
            onClick={fetchTokens}
            className="error-retry"
          >
            Try again
          </button>
        </div>
      )}

      {tokens.length === 0 ? (
        <div className="empty-state">
          <svg className="icon-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <h3 className="empty-title">No tokens found</h3>
          <p className="empty-description">Get started by creating your first token</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-secondary"
          >
            Create Token
          </button>
        </div>
      ) : (
        <div className="tokens-grid">
          {tokens.map((token) => (
            <TokenCard key={token.id} token={token} />
          ))}
        </div>
      )}

      <AddTokenModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddToken}
        isLoading={isSubmitting}
      />
    </div>
  );
}