import { Link } from 'react-router-dom';
import { getAllGames } from '../lib/games';

export default function GamesLibraryPage() {
  const games = getAllGames();

  return (
    <div className="page-placeholder">
      <h1>游戏说明库</h1>
      <p>各聚会游戏的规则说明与玩法介绍，后续版本完善。</p>

      <ul style={{ listStyle: 'none', textAlign: 'left', maxWidth: 360, margin: '0 auto' }}>
        {games.map((game) => (
          <li key={game.id} style={{ marginBottom: '0.5rem' }}>
            <Link to={`/games/${game.id}`}>{game.title}</Link>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
              {game.shortIntro}
            </span>
          </li>
        ))}
      </ul>

      <Link to="/" className="back-link">← 返回首页</Link>
    </div>
  );
}
