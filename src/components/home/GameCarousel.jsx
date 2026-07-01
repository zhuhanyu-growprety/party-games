import { Sparkles } from 'lucide-react';
import { getAllGames } from '../../lib/games';
import { getHomeGameIcon } from './homeIcons';

export default function GameCarousel() {
  const games = getAllGames();

  return (
    <section className="home-games-section">
      <h2 className="home-games-title">
        <Sparkles size={18} strokeWidth={1.75} className="home-games-title-icon" aria-hidden="true" />
        今晚玩什么
      </h2>
      <div className="home-games-scroll">
        {games.map((game) => {
          const Icon = getHomeGameIcon(game.id);
          return (
            <article key={game.id} className="home-game-card">
              <span className="home-game-icon" aria-hidden="true">
                <Icon size={26} strokeWidth={1.75} />
              </span>
              <h3>{game.title}</h3>
              <p>{game.shortIntro}</p>
              <span className="home-game-range">{game.playerRange}</span>
            </article>
          );
        })}
      </div>
    </section>
  );
}
