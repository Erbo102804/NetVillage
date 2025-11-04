import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>(initialMode);
  const [authData, setAuthData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await login(authData.email, authData.password);
      onClose();
      setAuthData({ name: '', email: '', password: '' });
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const switchMode = () => {
    setAuthMode(authMode === 'login' ? 'register' : 'login');
    setAuthData({ name: '', email: '', password: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        
        <div className="auth-content">
          <div className="auth-header">
            <h2 className="auth-title">
              {authMode === 'login' ? 'Вход в аккаунт' : 'Регистрация'}
            </h2>
            <p className="auth-subtitle">
              {authMode === 'login' 
                ? 'Войдите в свой аккаунт' 
                : 'Создайте новый аккаунт'}
            </p>
          </div>

          <form className="auth-form" onSubmit={handleAuth}>
            {authMode === 'register' && (
              <div className="form-group">
                <label className="form-label">Имя</label>
                <input
                  type="text"
                  value={authData.name}
                  onChange={(e) => setAuthData({...authData, name: e.target.value})}
                  className="form-input"
                  placeholder="Введите ваше имя"
                  required
                />
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                value={authData.email}
                onChange={(e) => setAuthData({...authData, email: e.target.value})}
                className="form-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Пароль</label>
              <input
                type="password"
                value={authData.password}
                onChange={(e) => setAuthData({...authData, password: e.target.value})}
                className="form-input"
                placeholder="Введите пароль"
                required
              />
            </div>

            <div className="auth-actions">
              <button
                type="button"
                onClick={onClose}
                className="auth-btn auth-btn-cancel"
                disabled={isLoading}
              >
                Отмена
              </button>
              <button
                type="submit"
                className="auth-btn auth-btn-submit"
                disabled={isLoading}
              >
                {isLoading ? '⏳' : ''}
                {isLoading 
                  ? 'Загрузка...' 
                  : authMode === 'login' 
                    ? 'Войти' 
                    : 'Зарегистрироваться'
                }
              </button>
            </div>

            <div className="auth-switch">
              <button
                type="button"
                onClick={switchMode}
                className="auth-switch-btn"
              >
                {authMode === 'login' 
                  ? 'Нет аккаунта? Зарегистрироваться' 
                  : 'Уже есть аккаунт? Войти'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
