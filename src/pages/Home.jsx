import { useNavigate } from 'react-router-dom';

const menuItems = [
  { label: 'スタッフ出退勤', path: '/staff-attendance' },
  { label: '当日予約ダッシュボード', path: '/reservations' },
  { label: '来店受付', path: '/checkin' },
  { label: '教室出席管理', path: '/class-attendance' },
  { label: 'レーン状況', path: '/lanes' },
  { label: '売上・利用履歴', path: '/sales' },
  { label: 'コーチシフト管理', path: '/coach-shifts' },
];

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('staffToken');
    navigate('/');
  };

  return (
    <div className="home-container">
      <div className="home-card">
        <h2>店舗・スタッフ管理 ホーム画面</h2>
        <div className="menu-grid">
          {menuItems.map((item) => (
            <button
              key={item.path}
              className="menu-button"
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <button className="logout-button" onClick={handleLogout}>
          ログアウト
        </button>
      </div>
    </div>
  );
}

export default Home;