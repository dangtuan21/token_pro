import React, { useState } from 'react';
import type { AddTokenInput } from './types';

interface AddTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tokenData: AddTokenInput) => void;
  isLoading?: boolean;
}

export function AddTokenModal({ isOpen, onClose, onSubmit, isLoading = false }: AddTokenModalProps) {
  const [formData, setFormData] = useState<AddTokenInput>({
    name: '',
    symbol: '',
    totalSupply: '',
    creator: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name.trim() || !formData.symbol.trim() || !formData.totalSupply.trim() || !formData.creator.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({ name: '', symbol: '', totalSupply: '', creator: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add New Token</h2>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Token Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="form-input"
              placeholder="e.g., My Awesome Token"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="symbol" className="form-label">
              Token Symbol
            </label>
            <input
              type="text"
              id="symbol"
              value={formData.symbol}
              onChange={(e) => setFormData({ ...formData, symbol: e.target.value.toUpperCase() })}
              className="form-input"
              placeholder="e.g., MAT"
              disabled={isLoading}
              maxLength={10}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="totalSupply" className="form-label">
              Total Supply
            </label>
            <input
              type="number"
              id="totalSupply"
              value={formData.totalSupply}
              onChange={(e) => setFormData({ ...formData, totalSupply: e.target.value })}
              className="form-input"
              placeholder="e.g., 1000000"
              disabled={isLoading}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="creator" className="form-label">
              Creator
            </label>
            <input
              type="text"
              id="creator"
              value={formData.creator}
              onChange={(e) => setFormData({ ...formData, creator: e.target.value })}
              className="form-input"
              placeholder="e.g., alice"
              disabled={isLoading}
              required
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="btn-cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-submit"
            >
              {isLoading ? 'Creating...' : 'Create Token'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}