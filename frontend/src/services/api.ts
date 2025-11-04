import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export const tariffsAPI = {
  getTariffs: () => api.get('/tariffs/'),
};

export const ordersAPI = {
  createOrder: (orderData: any) => api.post('/orders/', orderData),
};

export const paymentsAPI = {
  createKaspiPayment: (paymentData: any) => 
    api.post('/payments/kaspi/', paymentData),
};
