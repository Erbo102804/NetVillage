import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { Order, Payment, Tariff } from '../types';

interface DashboardProps {
  onNavigateToTariffs?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigateToTariffs }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'payments' | 'tariffs' | 'settings'>('overview');
  const { data: ordersData } = useApi<Order[]>('/orders/');
  const { data: paymentsData } = useApi<Payment[]>('/payments/');
  const { data: tariffsData } = useApi<Tariff[]>('/tariffs/');

  const orders: Order[] = ordersData || [];
  const payments: Payment[] = paymentsData || [];
  const tariffs: Tariff[] = tariffsData || [];

  // Фильтруем заказы и платежи по email пользователя
  const userOrders = orders.filter(order => order.customer_email === user?.email);
  const userPayments = payments.filter(payment => 
    userOrders.some(order => order.id === payment.order)
  );

  // Функция для перехода к тарифам
  const handleGoToTariffs = () => {
    setActiveTab('tariffs');
  };

  // Функция для подключения тарифа
  const handleSelectTariff = (tariff: Tariff) => {
    // Здесь можно добавить логику создания заказа
    alert(`Вы выбрали тариф "${tariff.name}" (${tariff.speed}) за ${tariff.price}₸/мес. Функция оформления заказа в разработке.`);
  };

  // Функция для получения названия тарифа по ID
  const getTariffName = (tariffId: number) => {
    const tariff = tariffs.find(t => t.id === tariffId);
    return tariff?.name || 'Тариф';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: { [key: string]: { color: string, bg: string, label: string } } = {
      'pending': { color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Ожидает оплаты' },
      'paid': { color: 'text-green-400', bg: 'bg-green-400/10', label: 'Оплачен' },
      'completed': { color: 'text-green-400', bg: 'bg-green-400/10', label: 'Завершен' },
      'failed': { color: 'text-red-400', bg: 'bg-red-400/10', label: 'Ошибка' },
      'cancelled': { color: 'text-gray-400', bg: 'bg-gray-400/10', label: 'Отменен' },
      'active': { color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Активен' }
    };

    const config = statusConfig[status] || { color: 'text-gray-400', bg: 'bg-gray-400/10', label: status };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
        {status === 'pending' && '⏳ '}
        {status === 'paid' && '✅ '}
        {status === 'completed' && '🎉 '}
        {status === 'failed' && '❌ '}
        {status === 'active' && '⚡ '}
        {status === 'cancelled' && '🚫 '}
        <span className="ml-1">{config.label}</span>
      </span>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="container">
        <div className="dashboard-header">
          <div className="user-welcome">
            <h1>
              Добро пожаловать, {user?.name}!
              <div className="welcome-subtitle">Управляйте своими услугами и платежами</div>
            </h1>
          </div>
          <div className="user-stats">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-info">
                <div className="stat-number">{userOrders.length}</div>
                <div className="stat-label">Всего заказов</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💳</div>
              <div className="stat-info">
                <div className="stat-number">
                  {userPayments.filter(p => p.status === 'completed').length}
                </div>
                <div className="stat-label">Оплаченные</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⏳</div>
              <div className="stat-info">
                <div className="stat-number">
                  {userPayments.filter(p => p.status === 'pending').length}
                </div>
                <div className="stat-label">В ожидании</div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="tabs-navigation">
            <button
              className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📈 Обзор
            </button>
            <button
              className={`tab-button ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              📦 Мои заказы
            </button>
            <button
              className={`tab-button ${activeTab === 'tariffs' ? 'active' : ''}`}
              onClick={() => setActiveTab('tariffs')}
            >
              🚀 Выбрать тариф
            </button>
            <button
              className={`tab-button ${activeTab === 'payments' ? 'active' : ''}`}
              onClick={() => setActiveTab('payments')}
            >
              💳 Платежи
            </button>
            <button
              className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              ⚙️ Настройки
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="overview-tab">
                <div className="recent-activity">
                  <h3>Последняя активность</h3>
                  <div className="activity-list">
                    {userPayments.slice(0, 5).map(payment => {
                      const order = userOrders.find(o => o.id === payment.order);
                      return (
                        <div key={payment.id} className="activity-item">
                          <div className="activity-icon">
                            {payment.status === 'completed' ? '✅' : '⏳'}
                          </div>
                          <div className="activity-details">
                            <div className="activity-title">
                              Платеж #{payment.id}
                            </div>
                            <div className="activity-description">
                              {order ? getTariffName(order.tariff) : 'Тариф'} • {payment.amount}₸
                            </div>
                            <div className="activity-time">
                              {formatDate(payment.created_at)}
                            </div>
                          </div>
                          <div className="activity-status">
                            {getStatusBadge(payment.status)}
                          </div>
                        </div>
                      );
                    })}
                    {userPayments.length === 0 && (
                      <div className="empty-state">
                        <div className="empty-icon">📊</div>
                        <h4>Пока нет активности</h4>
                        <p>После оформления заказа здесь появится информация о ваших платежах</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="quick-actions">
                  <h3>Быстрые действия</h3>
                  <div className="actions-grid">
                    <button className="action-card" onClick={handleGoToTariffs}>
                      <div className="action-icon">🚀</div>
                      <div className="action-title">Подключить новый тариф</div>
                      <div className="action-description">Выберите подходящую скорость</div>
                    </button>
                    <button className="action-card" onClick={() => alert('Функция в разработке')}>
                      <div className="action-icon">📱</div>
                      <div className="action-title">Мои устройства</div>
                      <div className="action-description">Управление подключенными устройствами</div>
                    </button>
                    <button className="action-card" onClick={() => alert('Свяжитесь с нами: +7 (777) 123-45-67')}>
                      <div className="action-icon">📞</div>
                      <div className="action-title">Техподдержка</div>
                      <div className="action-description">Помощь и консультации</div>
                    </button>
                    <button className="action-card" onClick={() => alert('Функция в разработке')}>
                      <div className="action-icon">📄</div>
                      <div className="action-title">Документы</div>
                      <div className="action-description">Договоры и счета</div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="orders-tab">
                <h3>История заказов</h3>
                <div className="orders-list">
                  {userOrders.map(order => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h4>Заказ #{order.id}</h4>
                          <p className="order-date">{formatDate(order.created_at)}</p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                      <div className="order-details">
                        <div className="order-tariff">
                          <span className="tariff-name">{getTariffName(order.tariff)}</span>
                          <span className="tariff-price">{order.amount}₸/мес</span>
                        </div>
                        <div className="customer-info">
                          <div className="info-item">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{order.customer_email}</span>
                          </div>
                          {order.customer_phone && (
                            <div className="info-item">
                              <span className="info-label">Телефон:</span>
                              <span className="info-value">{order.customer_phone}</span>
                            </div>
                          )}
                          {order.address && (
                            <div className="info-item">
                              <span className="info-label">Адрес:</span>
                              <span className="info-value">{order.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="order-actions">
                        <button className="btn btn-outline btn-sm">Детали</button>
                        {order.status === 'pending' && (
                          <button className="btn btn-primary btn-sm">Оплатить</button>
                        )}
                      </div>
                    </div>
                  ))}
                  {userOrders.length === 0 && (
                    <div className="empty-state">
                      <div className="empty-icon">📦</div>
                      <h4>Заказов пока нет</h4>
                      <p>Оформите первый заказ, чтобы увидеть его здесь</p>
                      <button className="btn btn-primary" onClick={handleGoToTariffs}>
                        Выбрать тариф
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'tariffs' && (
              <div className="tariffs-tab">
                <h3>Доступные тарифы</h3>
                <div className="tariffs-grid-dashboard">
                  {tariffs.map((tariff, index) => (
                    <div key={tariff.id} className={`tariff-card ${index === 1 ? 'popular' : ''}`}>
                      {index === 1 && (
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
                        <h4 className="tariff-name">{tariff.name}</h4>
                        <p className="tariff-speed">{tariff.speed}</p>
                        <div>
                          <div className="tariff-price">{tariff.price}₸</div>
                          <div className="tariff-period">/мес</div>
                        </div>
                      </div>
                      <ul className="tariff-features">
                        {tariff.features.map((feature, idx) => (
                          <li key={idx} className="tariff-feature">
                            <span className="feature-icon-check">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="tariff-actions">
                        <button 
                          className="btn btn-primary w-full"
                          onClick={() => handleSelectTariff(tariff)}
                          style={{
                            padding: '14px 24px',
                            fontSize: '0.95rem',
                            fontWeight: '600'
                          }}
                        >
                          Подключить тариф
                        </button>
                      </div>
                    </div>
                  ))}
                  {tariffs.length === 0 && (
                    <div className="empty-state">
                      <div className="empty-icon">🚀</div>
                      <h4>Тарифы загружаются...</h4>
                      <p>Пожалуйста, подождите</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="payments-tab">
                <h3>История платежей</h3>
                <div className="payments-list">
                  {userPayments.map(payment => {
                    const order = userOrders.find(o => o.id === payment.order);
                    return (
                      <div key={payment.id} className="payment-card">
                        <div className="payment-header">
                          <div className="payment-info">
                            <h4>Платеж #{payment.id}</h4>
                            <p className="payment-date">{formatDate(payment.created_at)}</p>
                          </div>
                          {getStatusBadge(payment.status)}
                        </div>
                        <div className="payment-details">
                          <div className="payment-amount">
                            <span className="amount">{payment.amount}₸</span>
                            <span className="method">{payment.payment_method}</span>
                          </div>
                          <div className="payment-order">
                            <span className="order-ref">Заказ #{payment.order}</span>
                            <span className="tariff-name">
                              {order ? getTariffName(order.tariff) : 'Тариф'}
                            </span>
                          </div>
                          {payment.transaction_id && (
                            <div className="transaction-id">
                              ID транзакции: {payment.transaction_id}
                            </div>
                          )}
                        </div>
                        <div className="payment-actions">
                          <button className="btn btn-outline btn-sm">Подробнее</button>
                          {payment.status === 'completed' && (
                            <button className="btn btn-outline btn-sm">Скачать чек</button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {userPayments.length === 0 && (
                    <div className="empty-state">
                      <div className="empty-icon">💳</div>
                      <h4>Платежей пока нет</h4>
                      <p>После оплаты заказа здесь появится информация о платежах</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-tab">
                <h3>Настройки аккаунта</h3>
                <div className="settings-grid">
                  <div className="setting-section">
                    <h4>Личная информация</h4>
                    <div className="setting-form">
                      <div className="form-group">
                        <label>Имя</label>
                        <input 
                          type="text" 
                          defaultValue={user?.name}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input 
                          type="email" 
                          defaultValue={user?.email}
                          className="form-input"
                          disabled
                        />
                      </div>
                      <button className="btn btn-primary">Сохранить изменения</button>
                    </div>
                  </div>

                  <div className="setting-section">
                    <h4>Безопасность</h4>
                    <div className="security-actions">
                      <button className="security-btn">
                        <span className="security-icon">🔒</span>
                        <span className="security-text">
                          <strong>Сменить пароль</strong>
                          <small>Обновите пароль для безопасности</small>
                        </span>
                      </button>
                      <button className="security-btn">
                        <span className="security-icon">📧</span>
                        <span className="security-text">
                          <strong>Уведомления</strong>
                          <small>Настройка email уведомлений</small>
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="setting-section">
                    <h4>Подписка</h4>
                    <div className="subscription-info">
                      <div className="subscription-status">
                        <span className="status-badge active">Активна</span>
                        <span className="status-text">
                          {userOrders.length > 0 ? 
                            `Тариф: ${getTariffName(userOrders[0].tariff)}` : 
                            'Тариф не выбран'
                          }
                        </span>
                      </div>
                      <div className="subscription-details">
                        <p>Следующее списание: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('ru-RU')}</p>
                        <p>Сумма: {userOrders.length > 0 ? `${userOrders[0].amount}₸` : '—'}</p>
                      </div>
                      <div className="subscription-actions">
                        <button className="btn btn-outline" onClick={handleGoToTariffs}>
                          Изменить тариф
                        </button>
                        <button className="btn btn-outline">Приостановить</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;