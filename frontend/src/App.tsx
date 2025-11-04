import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import AnimatedBackground from './components/AnimatedBackground';
import TariffCard from './components/TariffCard';
import PaymentForm from './components/PaymentForm';
import PaymentQR from './components/PaymentQR';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import { PaymentProvider, usePayment } from './context/PaymentContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useApi } from './hooks/useApi';
import { Tariff, Order, Payment } from './types';
import './App.css';

const HomePage: React.FC = () => {
  const { state, dispatch } = usePayment();
  const { data: tariffsData, loading, error } = useApi<Tariff[]>('/tariffs/');
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');

  const tariffs: Tariff[] = tariffsData || [];

  useEffect(() => {
    const checkAPI = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/health/');
        if (response.ok) {
          setApiStatus('connected');
        } else {
          setApiStatus('disconnected');
        }
      } catch (err) {
        setApiStatus('disconnected');
      }
    };

    checkAPI();
  }, []);

  const handleTariffSelect = (tariff: Tariff) => {
    dispatch({ type: 'SELECT_TARIFF', payload: tariff });
  };

  const handleBackToTariffs = () => {
    dispatch({ type: 'RESET_FLOW' });
  };

  const handleOrderCreated = (order: Order) => {
    dispatch({ type: 'CREATE_ORDER_SUCCESS', payload: order });
  };

  const handlePaymentCreated = (payment: Payment) => {
    dispatch({ type: 'CREATE_PAYMENT_SUCCESS', payload: payment });
  };

  if (state.currentStep === 'payment_form') {
    return (
      <div className="container">
        <PaymentForm
          tariff={state.selectedTariff!}
          onBack={handleBackToTariffs}
          onOrderCreated={handleOrderCreated}
          onPaymentCreated={handlePaymentCreated}
        />
      </div>
    );
  }

  if (state.currentStep === 'payment_qr') {
    return (
      <div className="container">
        <PaymentQR
          payment={state.payment!}
          onBack={handleBackToTariffs}
        />
      </div>
    );
  }

  return (
    <>
      {/* 1. Hero секция */}
      <section className="hero">
        <div className="container">
          <h1>Сверхбыстрый интернет</h1>
          <p className="hero-subtitle">
            Профессиональное оборудование и стабильное подключение.<br />
            Роутер и месяц интернета в подарок при покупке антенны!
          </p>
          <div className="hero-actions">
            <a href="#equipment" className="btn btn-neon">
              Посмотреть оборудование →
            </a>
            <a href="#tariffs" className="btn btn-outline">
              Тарифные планы
            </a>
          </div>
        </div>
      </section>

      {/* 2. Спецпредложение */}
      <section id="equipment" className="special-offer-section">
        <div className="container">
          <div className="special-offer">
            <div className="special-offer-content">
              <h2>СУПЕР ПРЕДЛОЖЕНИЕ</h2>
              <p className="special-offer-subtitle">
                Антенна за 80,000 ₸ + подарки!
              </p>
              <p className="special-offer-description">
                При покупке NanoStation Loco M5 вы получаете:
              </p>
              
              <div className="offer-features">
                <div className="offer-feature">
                  <h4>Профессиональная антенна</h4>
                  <p>До 15 км, скорость 150 Мбит/с</p>
                </div>
                <div className="offer-feature">
                  <h4>Wi-Fi роутер в подарок</h4>
                  <p>АС1200, стоимостью 18,000 ₸</p>
                </div>
                <div className="offer-feature">
                  <h4>Месяц интернета бесплатно</h4>
                  <p>Любой тариф на выбор</p>
                </div>
              </div>

              <div className="price-section">
                <div className="old-price">98,000 ₸</div>
                <div className="new-price">80,000 ₸</div>
              </div>

              <button className="btn btn-electric">
                Получить предложение →
              </button>

              <p className="special-offer-note">
                + Бесплатная установка и настройка
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Преимущества */}
      <section id="features" className="features">
        <div className="container">
          <h2>Почему выбирают нас</h2>
          <p className="features-subtitle">
            Надежное подключение с профессиональным сервисом
          </p>

          <div className="features-grid-alt">
            <div className="feature-item">
              <div className="feature-content">
                <h3>Стабильность</h3>
                <p>99.9% времени работы</p>
              </div>
            </div>
            <div className="feature-divider"></div>
            
            <div className="feature-item">
              <div className="feature-content">
                <h3>Быстрое подключение</h3>
                <p>Установка за 24 часа</p>
              </div>
            </div>
            <div className="feature-divider"></div>
            
            <div className="feature-item">
              <div className="feature-content">
                <h3>Современное оборудование</h3>
                <p>Только лучшие производители</p>
              </div>
            </div>
            <div className="feature-divider"></div>
            
            <div className="feature-item">
              <div className="feature-content">
                <h3>Выгодные предложения</h3>
                <p>Подарки для новых клиентов</p>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <h3>Готовы подключиться?</h3>
            <p>Выберите оборудование и начните пользоваться быстрым интернетом уже сегодня.</p>
            <a href="#equipment" className="btn btn-neon">
              Выбрать оборудование →
            </a>
          </div>
        </div>
      </section>

      {/* 4. Тарифы */}
      <section id="tariffs" className="tariffs-section">
        <div className="container">
          <div className="section-header">
            <h2>Выберите оптимальную скорость для ваших задач</h2>
          </div>

          {loading ? (
            <Loader text="Загрузка тарифов..." />
          ) : error && tariffs.length === 0 ? (
            <ErrorMessage 
              message={error} 
              onRetry={() => window.location.reload()} 
            />
          ) : (
            <div className="tariffs-grid-alt">
              {tariffs.map((tariff, index) => (
                <TariffCard
                  key={tariff.id}
                  tariff={tariff}
                  onSelect={handleTariffSelect}
                  isPopular={index === 1}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
};

const AppContent: React.FC = () => {
  const { state } = usePayment();
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');

  // Автоматический переход в Dashboard при логине
  useEffect(() => {
    if (user && currentView === 'home') {
      setCurrentView('dashboard');
    }
  }, [user, currentView]);

  const renderContent = () => {
    if (state.error) {
      return (
        <div className="container">
          <ErrorMessage 
            message={state.error} 
            onRetry={() => window.location.reload()}
          />
        </div>
      );
    }

    if (currentView === 'dashboard') {
      return <Dashboard />;
    }

    return <HomePage />;
  };

  return (
    <div className="app">
      <AnimatedBackground />
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      
      <main>
        {renderContent()}
      </main>

      <footer className="footer">
        <div className="container">
          <p>© 2024 NetVillage. Все права защищены.</p>
          <p>Техническая поддержка: +7 (777) 123-45-67</p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <AppContent />
      </PaymentProvider>
    </AuthProvider>
  );
}

export default App;