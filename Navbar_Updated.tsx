import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

interface NavbarProps {
  currentView: 'home' | 'dashboard';
  onViewChange: (view: 'home' | 'dashboard') => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleRegisterClick = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    onViewChange('home');
  };

  const handleLogoClick = () => {
    onViewChange('home');
  };

  const handleDashboardClick = () => {
    onViewChange('dashboard');
  };

  const handleHomeClick = () => {
    onViewChange('home');
  };

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-content">
            <div
              className="logo"
              onClick={handleLogoClick}
              style={{ cursor: 'pointer' }}
            >
              NetVillage
            </div>

            {currentView === 'home' && (
              <div className="nav-links">
                <a href="#tariffs" className="nav-link">Тарифы</a>
                <a href="#equipment" className="nav-link">Оборудование</a>
                <a href="#features" className="nav-link">Преимущества</a>
                <a href="#support" className="nav-link">Поддержка</a>
              </div>
            )}

            <div className="auth-buttons">
              {user ? (
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleDashboardClick}
                    className="btn btn-outline"
                  >
                    👤 Личный кабинет
                  </button>
                  {currentView === 'dashboard' && (
                    <button
                      onClick={handleHomeClick}
                      className="btn btn-outline"
                    >
                      🏠 На главную
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline"
                  >
                    Выйти
                  </button>
                  {/* Кнопка админ панели для залогиненных пользователей */}
                  <a
                    href="http://localhost:8000/admin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-admin"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      border: 'none',
                    }}
                  >
                    🔐 Админ
                  </a>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleLoginClick}
                    className="btn btn-outline"
                  >
                    Войти
                  </button>
                  <button
                    onClick={handleRegisterClick}
                    className="btn btn-primary"
                  >
                    Регистрация
                  </button>
                  {/* Кнопка админ панели для незалогиненных пользователей */}
                  <a
                    href="http://localhost:8000/admin/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-admin"
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: '500',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    🔐 Админ
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

export default Navbar;
