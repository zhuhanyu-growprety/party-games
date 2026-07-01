import { Link } from 'react-router-dom';
import { Users, BookOpen, Lightbulb } from 'lucide-react';

export default function HomeNav() {
  return (
    <header className="home-nav">
      <Link to="/" className="home-nav-brand">
        <span className="home-nav-logo" aria-hidden="true">
          <Users size={20} strokeWidth={2} />
        </span>
        <span>聚会游戏合集</span>
      </Link>
      <nav className="home-nav-links">
        <Link to="/games">
          <BookOpen size={16} strokeWidth={1.75} aria-hidden="true" />
          玩法介绍
        </Link>
        <Link to="/about">
          <Lightbulb size={16} strokeWidth={1.75} aria-hidden="true" />
          使用小贴士
        </Link>
      </nav>
    </header>
  );
}
