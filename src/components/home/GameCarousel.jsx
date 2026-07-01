import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { getAllGames } from '../../lib/games';

export default function GameCarousel() {
  const games = getAllGames();
  const scrollRef = useRef(null);

  function scroll(direction) {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.72;
    el.scrollBy({ left: direction * amount, behavior: 'smooth' });
  }

  return (
    <section className="home-games-section">
      <h2 className="home-games-title">
        <Sparkles size={18} strokeWidth={1.75} className="home-games-title-icon" aria-hidden="true" />
        今晚玩什么
        <Sparkles size={14} strokeWidth={1.75} className="home-games-title-icon home-games-title-icon--sm" aria-hidden="true" />
      </h2>

      <div className="home-games-carousel">
        <button
          type="button"
          className="home-games-arrow home-games-arrow--left"
          onClick={() => scroll(-1)}
          aria-label="向左滚动"
        >
          <ChevronLeft size={20} strokeWidth={2} />
        </button>

        <div className="home-games-scroll" ref={scrollRef}>
          {games.map((game) => (
            <article key={game.id} className="home-game-card">
              <div className="home-game-image-wrap">
                <img
                  className="home-game-image"
                  src={game.image}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                />
              </div>
              <h3>{game.title}</h3>
              <p>{game.shortIntro}</p>
              <span className="home-game-range">{game.playerRange}</span>
            </article>
          ))}
        </div>

        <button
          type="button"
          className="home-games-arrow home-games-arrow--right"
          onClick={() => scroll(1)}
          aria-label="向右滚动"
        >
          <ChevronRight size={20} strokeWidth={2} />
        </button>
      </div>
    </section>
  );
}
