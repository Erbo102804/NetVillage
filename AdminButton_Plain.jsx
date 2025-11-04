import React from 'react';

/**
 * Кнопка для перехода в админ панель Django (БЕЗ Tailwind CSS)
 * Добавьте этот компонент в ваш Header или Navbar
 */
const AdminButton = () => {
  const buttonStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.75rem 1.25rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
  };

  const buttonHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  };

  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <a
      href="http://localhost:8000/admin/"
      target="_blank"
      rel="noopener noreferrer"
      style={{...buttonStyle, ...(isHovered ? buttonHoverStyle : {})}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7v10c0 5.5 4.5 10 10 10s10-4.5 10-10V7l-10-5z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      <span>Админ панель</span>
    </a>
  );
};

export default AdminButton;

/**
 * ИНСТРУКЦИЯ ПО УСТАНОВКЕ:
 *
 * 1. Скопируйте этот файл в src/components/AdminButton.jsx
 *
 * 2. Импортируйте в ваш Header/Navbar компонент:
 *    import AdminButton from './components/AdminButton';
 *
 * 3. Добавьте компонент в JSX:
 *    <AdminButton />
 *
 * ПРИМЕР ИСПОЛЬЗОВАНИЯ В APP.JS:
 *
 * import AdminButton from './components/AdminButton';
 *
 * function App() {
 *   return (
 *     <div className="App">
 *       <header style={{
 *         display: 'flex',
 *         justifyContent: 'space-between',
 *         alignItems: 'center',
 *         padding: '1rem 2rem',
 *         background: 'white',
 *         boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
 *       }}>
 *         <h1>NetVillage</h1>
 *         <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
 *           <a href="/">Главная</a>
 *           <a href="/tariffs">Тарифы</a>
 *           <AdminButton />
 *         </nav>
 *       </header>
 *
 *       {/* Остальной контент */}
 *     </div>
 *   );
 * }
 */
