import React, { createContext, useContext, useReducer } from 'react';
import { Tariff, Order, Payment } from '../types';

interface PaymentState {
  currentStep: 'tariffs' | 'payment_form' | 'payment_qr';
  selectedTariff: Tariff | null;
  order: Order | null;
  payment: Payment | null;
  loading: boolean;
  error: string | null;
}

type PaymentAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SELECT_TARIFF'; payload: Tariff }
  | { type: 'CREATE_ORDER_SUCCESS'; payload: Order }
  | { type: 'CREATE_PAYMENT_SUCCESS'; payload: Payment }
  | { type: 'RESET_FLOW' }
  | { type: 'GO_BACK' };

const initialState: PaymentState = {
  currentStep: 'tariffs',
  selectedTariff: null,
  order: null,
  payment: null,
  loading: false,
  error: null
};

const paymentReducer = (state: PaymentState, action: PaymentAction): PaymentState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SELECT_TARIFF':
      return { 
        ...state, 
        selectedTariff: action.payload,
        currentStep: 'payment_form',
        error: null 
      };
    case 'CREATE_ORDER_SUCCESS':
      return { 
        ...state, 
        order: action.payload,
        currentStep: 'payment_qr',
        error: null 
      };
    case 'CREATE_PAYMENT_SUCCESS':
      return { 
        ...state, 
        payment: action.payload,
        error: null 
      };
    case 'RESET_FLOW':
      return initialState;
    case 'GO_BACK':
      return {
        ...state,
        currentStep: state.currentStep === 'payment_qr' ? 'payment_form' : 'tariffs',
        payment: state.currentStep === 'payment_qr' ? null : state.payment
      };
    default:
      return state;
  }
};

const PaymentContext = createContext<{
  state: PaymentState;
  dispatch: React.Dispatch<PaymentAction>;
} | null>(null);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(paymentReducer, initialState);

  return (
    <PaymentContext.Provider value={{ state, dispatch }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayment must be used within a PaymentProvider');
  }
  return context;
};
