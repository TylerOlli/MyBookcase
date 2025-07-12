import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function DeleteConfirmModal({ isOpen, onClose, onConfirm, shelfName, isDeleting }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            border: '1px solid #e2e8f0'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              borderRadius: '50%', 
              background: '#fef2f2', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1e293b', 
              marginBottom: '0.5rem' 
            }}>
              Delete Shelf
            </h3>
            <p style={{ 
              color: '#64748b', 
              lineHeight: '1.5',
              margin: 0
            }}>
              Are you sure you want to delete <strong>"{shelfName}"</strong>? 
              This action cannot be undone and all books in this shelf will be permanently removed.
            </p>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            justifyContent: 'center'
          }}>
            <button
              onClick={onClose}
              disabled={isDeleting}
              style={{
                background: '#f1f5f9',
                color: '#475569',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '100px'
              }}
              onMouseEnter={(e) => {
                if (!isDeleting) {
                  e.target.style.background = '#e2e8f0';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDeleting) {
                  e.target.style.background = '#f1f5f9';
                }
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              style={{
                background: isDeleting ? '#94a3b8' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '0.75rem 1.5rem',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '100px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (!isDeleting) {
                  e.target.style.background = '#dc2626';
                }
              }}
              onMouseLeave={(e) => {
                if (!isDeleting) {
                  e.target.style.background = '#ef4444';
                }
              }}
            >
              {isDeleting ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    <path d="M9 12l2 2 4-4"/>
                  </svg>
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DeleteConfirmModal; 