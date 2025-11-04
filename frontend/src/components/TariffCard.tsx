import React from 'react';
import { Tariff } from '../types';

interface TariffCardProps {
  tariff: Tariff;
  onSelect: (tariff: Tariff) => void;
  isPopular?: boolean;
}

const TariffCard: React.FC<TariffCardProps> = ({ tariff, onSelect, isPopular = false }) => {
  return (
    <div className={`tariff-card ${isPopular ? 'popular' : ''}`}>
      {isPopular && (
        <div style={{
          position: 'absolute',
          top: '15px',
          right: '15px',
          background: 'var(--hyper-gradient)',
          color: 'white',
          padding: '6px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          zIndex: 3
        }}>
          Популярный
        </div>
      )}
      
      <div className="tariff-header">
        <h3 className="tariff-name">{tariff.name}</h3>
        <p className="tariff-speed">{tariff.speed}</p>
        <div>
          <div className="tariff-price">{tariff.price}₸</div>
          <div className="tariff-period">/мес</div>
        </div>
      </div>
      
      <ul className="tariff-features">
        {tariff.features.map((feature, index) => (
          <li key={index} className="tariff-feature">
            <span className="feature-icon-check">✓</span>
            {feature}
          </li>
        ))}
      </ul>
      
      <div className="tariff-actions">
        <button 
          className="btn btn-primary w-full"
          onClick={() => onSelect(tariff)}
          style={{
            padding: '14px 24px',
            fontSize: '0.95rem',
            fontWeight: '600'
          }}
        >
          Выбрать тариф
        </button>
      </div>
    </div>
  );
};

export default TariffCard;
