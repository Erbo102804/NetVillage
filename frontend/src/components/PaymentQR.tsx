import React from 'react';
import { Payment } from '../types';

interface PaymentQRProps {
  payment: Payment;
  onBack: () => void;
}

const PaymentQR: React.FC<PaymentQRProps> = ({ payment, onBack }) => {
  return (
    <div className="qr-container">
      <h2 className="qr-title">Оплата через Kaspi</h2>
      <p className="qr-subtitle">Сканируйте QR код для оплаты</p>
      
      <div style={{ 
        marginBottom: '32px', 
        padding: '20px', 
        background: 'var(--dark-bg)', 
        borderRadius: '12px',
        border: '1px solid var(--dark-border)'
      }}>
        <div className="qr-amount">{payment.amount}₸</div>
        <p style={{ color: 'var(--text-muted)' }}>Сумма к оплате</p>
      </div>

      <div className="qr-code">
        <div className="qr-placeholder">
          📱
        </div>
      </div>

      <p className="qr-instruction">
        Откройте приложение Kaspi, нажмите на кнопку «Оплатить по QR-коду», 
        наведите камеру на код или нажмите на ссылку ниже для перехода в приложение
      </p>

      {payment.payment_url && (
        <a
          href={payment.payment_url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
          style={{ marginBottom: '24px' }}
        >
          Открыть в Kaspi
        </a>
      )}

      <div className="flex items-center justify-center mb-4">
        <div className="status-indicator">
          <div className="status-dot"></div>
          Ожидание оплаты
        </div>
      </div>
      
      <button
        onClick={onBack}
        className="btn btn-secondary"
      >
        Вернуться к тарифам
      </button>
    </div>
  );
};

export default PaymentQR;
