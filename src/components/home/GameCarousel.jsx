import { getAllGames, getGameIcon } from '../../lib/games';

export default function GameCarousel() {
  const games = getAllGames();

  return (
    <section className="home-games-section">
      <h2 className="home-games-title">
        <span aria-hidden="true">✨</span>
        今晚玩什么
        <span aria-hidden="true">✨</span>
      </h2>
      <div className="home-games-scroll">
        {games.map((game) => (
          <article key={game.id} className="home-game-card card">
            <span className="home-game-icon" aria-hidden="true">
              {getGameIcon(game.id)}
            </span>
            <h3>{game.title}</h3>
            <p>{game.shortIntro}</p>
            <span className="home-game-range">{game.playerRange}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
