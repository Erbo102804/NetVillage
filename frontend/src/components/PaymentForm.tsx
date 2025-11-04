import React, { useState } from 'react';
import { Tariff, Order, Payment } from '../types';
import { ordersAPI, paymentsAPI } from '../services/api';
import { usePayment } from '../context/PaymentContext';
import Loader from './Loader';

interface PaymentFormProps {
  tariff: Tariff;
  onBack: () => void;
  onOrderCreated: (order: Order) => void;
  onPaymentCreated: (payment: Payment) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ 
  tariff, 
  onBack, 
  onOrderCreated, 
  onPaymentCreated 
}) => {
  const { dispatch } = usePayment();
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    address: ''
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const orderResponse = await ordersAPI.createOrder({
        tariff: tariff.id,
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        customer_phone: formData.customer_phone,
        address: formData.address
      });

      const order: Order = orderResponse.data;
      onOrderCreated(order);

      const paymentResponse = await paymentsAPI.createKaspiPayment({
        order_id: order.id
      });

      const payment: Payment = paymentResponse.data;
      onPaymentCreated(payment);

      dispatch({ type: 'SET_ERROR', payload: null });
    } catch (error: any) {
      console.error('Payment creation error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Ошибка при создании платежа' });
    } finally {
      setLoading(false);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getInputStyle = (fieldName: string) => {
    const baseStyle = 'form-input';
    return focusedField === fieldName ? `${baseStyle} form-input-focused` : baseStyle;
  };

  if (loading) {
    return (
      <div className="form-container">
        <Loader text="Создание заказа..." />
      </div>
    );
  }

  return (
    <div className="form-container">
      <h2 className="form-title">Оформление заказа</h2>
      <p className="form-subtitle">Заполните данные для подключения</p>
      
      <div style={{ 
        marginBottom: '32px', 
        padding: '20px', 
        background: 'var(--dark-bg)', 
        borderRadius: '12px',
        border: '1px solid var(--dark-border)'
      }}>
        <h3 style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '8px' }}>{tariff.name}</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '12px' }}>{tariff.speed}</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary-blue-light)' }}>
          {tariff.price}₸/месяц
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">ФИО *</label>
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            onFocus={() => setFocusedField('customer_name')}
            onBlur={() => setFocusedField(null)}
            required
            className={getInputStyle('customer_name')}
            placeholder="Введите ваше полное имя"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email *</label>
          <input
            type="email"
            name="customer_email"
            value={formData.customer_email}
            onChange={handleChange}
            onFocus={() => setFocusedField('customer_email')}
            onBlur={() => setFocusedField(null)}
            required
            className={getInputStyle('customer_email')}
            placeholder="your@email.com"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Телефон</label>
          <input
            type="tel"
            name="customer_phone"
            value={formData.customer_phone}
            onChange={handleChange}
            onFocus={() => setFocusedField('customer_phone')}
            onBlur={() => setFocusedField(null)}
            className={getInputStyle('customer_phone')}
            placeholder="+7 (777) 123-45-67"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Адрес подключения</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            onFocus={() => setFocusedField('address')}
            onBlur={() => setFocusedField(null)}
            rows={4}
            className={`${getInputStyle('address')} form-textarea`}
            placeholder="Введите полный адрес для подключения"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onBack}
            disabled={loading}
            className="btn btn-secondary"
            style={{ flex: 1 }}
          >
            Назад
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ flex: 1 }}
          >
            {loading ? 'Создание...' : 'Перейти к оплате'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
