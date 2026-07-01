import { getGameIcon } from '../../lib/games';

export default function GameList({ games, selectedId, onSelect }) {
  return (
    <div className="game-list-wrap">
      <h3 className="game-list-title">切换游戏</h3>
      <ul className="game-list">
        {games.map((game) => (
          <li key={game.id}>
            <button
              type="button"
              className={`game-list-item${selectedId === game.id ? ' active' : ''}`}
              onClick={() => onSelect(game.id)}
            >
              <span className="game-list-icon" aria-hidden="true">
                {getGameIcon(game.id)}
              </span>
              <span className="game-list-name">{game.title}</span>
              {selectedId === game.id && (
                <span className="game-list-arrow" aria-hidden="true">›</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
