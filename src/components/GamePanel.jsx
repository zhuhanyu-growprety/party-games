import WerewolfPanel from './games/WerewolfPanel';
import TruthOrDarePanel from './games/TruthOrDarePanel';
import NumberBombPanel from './games/NumberBombPanel';
import CategoryGardenPanel from './games/CategoryGardenPanel';
import TurtleSoupPanel from './games/TurtleSoupPanel';
import LuckyWheelPanel from './games/LuckyWheelPanel';
import KingGamePanel from './games/KingGamePanel';
import WhoAmIPanel from './games/WhoAmIPanel';
import UndercoverPanel from './games/UndercoverPanel';
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

  if (game.id === 'bomb') {
    return <NumberBombPanel game={game} />;
  }

  if (game.id === 'garden') {
    return <CategoryGardenPanel game={game} />;
  }

  if (game.id === 'turtle-soup') {
    return <TurtleSoupPanel game={game} />;
  }

  if (game.id === 'wheel') {
    return <LuckyWheelPanel game={game} />;
  }

  if (game.id === 'king') {
    return <KingGamePanel game={game} />;
  }

  if (game.id === 'whoami') {
    return <WhoAmIPanel game={game} />;
  }

  if (game.id === 'undercover') {
    return <UndercoverPanel game={game} />;
  }

  return <PlaceholderPanel game={game} />;
}
