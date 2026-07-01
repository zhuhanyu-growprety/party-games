import { getPlaceholderHint } from '../../lib/games';

export default function PlaceholderPanel({ game }) {
  const hint = getPlaceholderHint(game.id);

  return (
    <div className="game-panel placeholder-panel">
      <div className="game-panel-header">
        <h2>{game.title}</h2>
        <p>{game.shortIntro}</p>
      </div>

      <div className="game-panel-placeholder card">
        {game.image && (
          <img
            className="placeholder-thumb"
            src={game.image}
            alt=""
            aria-hidden="true"
          />
        )}
        <p className="placeholder-status">该游戏面板正在建设中</p>
        <p className="placeholder-hint">{hint}</p>
        <span className="placeholder-range">{game.playerRange}</span>
      </div>
    </div>
  );
}
