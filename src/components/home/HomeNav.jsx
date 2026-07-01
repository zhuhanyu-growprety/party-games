import { Link } from 'react-router-dom';

export default function HomeNav() {
  return (
    <header className="home-nav">
      <Link to="/" className="home-nav-brand">
        <span className="home-nav-logo" aria-hidden="true">👥</span>
        <span>聚会游戏合集</span>
      </Link>
      <nav className="home-nav-links">
        <Link to="/games">玩法介绍</Link>
        <Link to="/about">使用小贴士</Link>
      </nav>
    </header>
  );
}
