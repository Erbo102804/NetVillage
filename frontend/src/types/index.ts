export interface Tariff {
  id: number;
  name: string;
  speed: string;
  price: number;
  description: string;
  features: string[];
  is_active: boolean;
  created_at: string;
}

export interface Order {
  id: number;
  tariff: number;
  tariff_name: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  address?: string;
  amount: number;
  status: 'pending' | 'paid' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  order: number;
  amount: number;
  payment_method: 'kaspi' | 'cash';
  status: 'pending' | 'completed' | 'failed';
  transaction_id?: string;
  payment_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentContextType {
  state: PaymentState;
  dispatch: React.Dispatch<PaymentAction>;
}

export interface PaymentState {
  currentStep: 'tariffs' | 'payment_form' | 'payment_qr';
  selectedTariff: Tariff | null;
  order: Order | null;
  payment: Payment | null;
  loading: boolean;
  error: string | null;
}

export type PaymentAction = 
  | { type: 'SELECT_TARIFF'; payload: Tariff }
  | { type: 'CREATE_ORDER_SUCCESS'; payload: Order }
  | { type: 'CREATE_PAYMENT_SUCCESS'; payload: Payment }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_FLOW' };
