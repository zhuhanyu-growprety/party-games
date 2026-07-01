import WerewolfPanel from './games/WerewolfPanel';
import PlaceholderPanel from './games/PlaceholderPanel';

export default function GamePanel({ game }) {
  if (!game) {
    return (
      <div className="game-panel">
        <p className="game-panel-empty">请从右侧选择一个游戏</p>
      </div>
    );
  }

  if (game.id === 'werewolf') {
    return <WerewolfPanel />;
  }

  return <PlaceholderPanel game={game} />;
}
