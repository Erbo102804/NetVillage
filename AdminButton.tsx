import React from 'react';

/**
 * Кнопка для перехода в админ панель Django
 * Добавьте этот компонент в ваш Header или Navbar
 */
const AdminButton: React.FC = () => {
  return (
    <a
      href="http://localhost:8000/admin/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
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
      <span className="font-medium">Админ панель</span>
    </a>
  );
};

export default AdminButton;

/**
 * ИНСТРУКЦИЯ ПО УСТАНОВКЕ:
 *
 * 1. Скопируйте этот файл в src/components/AdminButton.tsx
 *
 * 2. Импортируйте в ваш Header/Navbar компонент:
 *    import AdminButton from './components/AdminButton';
 *
 * 3. Добавьте компонент в JSX:
 *    <AdminButton />
 *
 * 4. Если не используете Tailwind CSS, замените className на:
 *
 *    style={{
 *      display: 'flex',
 *      alignItems: 'center',
 *      gap: '0.5rem',
 *      padding: '0.5rem 1rem',
 *      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
 *      color: 'white',
 *      borderRadius: '0.5rem',
 *      textDecoration: 'none',
 *      fontWeight: '500',
 *      transition: 'all 0.3s',
 *      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
 *    }}
 *
 * ПРИМЕР ИСПОЛЬЗОВАНИЯ В HEADER:
 *
 * const Header = () => {
 *   return (
 *     <header className="flex justify-between items-center p-4 bg-white shadow">
 *       <h1>NetVillage</h1>
 *       <nav className="flex gap-4 items-center">
 *         <Link to="/">Главная</Link>
 *         <Link to="/tariffs">Тарифы</Link>
 *         <AdminButton />
 *       </nav>
 *     </header>
 *   );
 * };
 */
