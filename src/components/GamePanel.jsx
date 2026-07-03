import WerewolfPanel from './games/WerewolfPanel';
import TruthOrDarePanel from './games/TruthOrDarePanel';
import PlaceholderPanel from './games/PlaceholderPanel';

export default function GamePanel({ game, werewolfSession, onWerewolfSessionChange }) {
  if (!game) {
    return (
      <div className="game-panel">
        <p className="game-panel-empty">请从右侧选择一个游戏</p>
      </div>
    );
  }

  if (game.id === 'werewolf') {
    return (
      <WerewolfPanel
        session={werewolfSession}
        onSessionChange={onWerewolfSessionChange}
      />
    );
  }

  if (game.id === 'truth-dare') {
    return <TruthOrDarePanel game={game} />;
  }

  return <PlaceholderPanel game={game} />;
}
