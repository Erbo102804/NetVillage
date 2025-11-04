import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div style={{
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flexShrink: 0 }}>
          <svg style={{ width: '1.25rem', height: '1.25rem', color: '#dc2626' }} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div style={{ marginLeft: '0.75rem' }}>
          <h3 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#dc2626' }}>Ошибка</h3>
          <div style={{ marginTop: '0.25rem', fontSize: '0.875rem', color: '#b91c1c' }}>
            <p>{message}</p>
          </div>
          {onRetry && (
            <div style={{ marginTop: '1rem' }}>
              <button
                onClick={onRetry}
                style={{
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Попробовать снова
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
