import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 'md', text = 'Загрузка...' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '60px 20px',
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      borderRadius: '20px',
      margin: '20px'
    }}>
      <div 
        style={{ 
          animation: 'spin 1s linear infinite',
          borderRadius: '50%',
          border: '3px solid #f3f4f6',
          borderTop: '3px solid #667eea',
          width: size === 'sm' ? '2rem' : size === 'md' ? '3rem' : '4rem',
          height: size === 'sm' ? '2rem' : size === 'md' ? '3rem' : '4rem',
          marginBottom: '16px'
        }}
      ></div>
      {text && <p style={{ color: '#6b7280', margin: 0 }}>{text}</p>}
    </div>
  );
};

export default Loader;
