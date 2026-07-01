import { Link, useParams } from 'react-router-dom';
import { getGameById, getPlaceholderHint } from '../lib/games';

export default function GameDetailPage() {
  const { id } = useParams();
  const game = getGameById(id);

  if (!game) {
    return (
      <div className="page-placeholder">
        <h1>游戏未找到</h1>
        <p>该游戏不存在或尚未收录。</p>
        <Link to="/games" className="back-link">← 返回游戏库</Link>
      </div>
    );
  }

  const hint = game.status === 'active'
    ? game.shortIntro
    : getPlaceholderHint(game.id);

  return (
    <div className="page-placeholder">
      <h1>{game.title}</h1>
      <p>{game.shortIntro}</p>
      <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>{hint}</p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        推荐人数：{game.playerRange}
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1.5rem' }}>
        详细规则说明将在后续版本补充。
      </p>
      <Link to="/games" className="back-link">← 返回游戏库</Link>
    </div>
  );
}
