// Простая кнопка для перехода в Django Admin
// Добавь этот код в твой React компонент (Header или App.js)

export const AdminButton = () => {
  return (
    <a
      href="http://localhost:8000/admin/"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 20px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        borderRadius: '8px',
        textDecoration: 'none',
        fontWeight: '500',
        fontSize: '14px',
        transition: 'all 0.3s',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7v10c0 5.5 4.5 10 10 10s10-4.5 10-10V7l-10-5z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
      Админ панель
    </a>
  );
};

// БЫСТРАЯ УСТАНОВКА:
// 1. Скопируй эту функцию AdminButton в твой Header.jsx или App.js
// 2. Используй так: <AdminButton />
//
// Пример:
// function Header() {
//   return (
//     <header>
//       <h1>NetVillage</h1>
//       <AdminButton />
//     </header>
//   );
// }
