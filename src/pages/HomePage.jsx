import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { getHomeRecommendationSections, getQuickChips, updateBookStatus } from '../lib/books';
import { useReadingState } from '../hooks/useReadingState';

const PLACEHOLDERS = [
  '我想看一本 CP 张力强但不要太虐的长篇',
  '我想看设定复杂、后劲强的',
  '我想看甜文低门槛',
  '我想看无限流但不要太吓人',
  '我不想看前期太慢的',
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isWantToRead } = useReadingState();
  const [query, setQuery] = useState('');
  const [placeholder] = useState(() => PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
  const sections = getHomeRecommendationSections();
  const chips = getQuickChips();
  const visibleChips = chips.slice(0, 5);

  const handleSearch = () => {
    if (!query.trim()) return;
    navigate(`/recommend?q=${encodeURIComponent(query.trim())}`);
  };

  const handleChip = (chip) => {
    if (chip.action === 'filter') {
      navigate(`/books?badge=${encodeURIComponent(chip.label)}`);
    } else {
      navigate(`/recommend?q=${encodeURIComponent(chip.label)}`);
    }
  };

  const handleWantToRead = (id) => {
    updateBookStatus(id, 'wantToRead');
  };

  return (
    <div>
      <section className="bg-gradient-to-b from-paper-dark/50 to-paper px-4 py-8 md:py-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-ink mb-2">
            长篇网络小说不剧透入坑地图
          </h1>
          <p className="text-ink-muted text-sm md:text-base mb-5">
            不是告诉你剧情，而是告诉你：这本书值不值得继续读。
          </p>

          <div className="bg-card rounded-xl border border-paper-dark/60 shadow-md p-4 text-left">
            <label className="block text-xs font-medium text-ink-muted mb-1.5">
              描述你想看什么样的书
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={placeholder}
                className="flex-1 px-3 py-2.5 bg-paper border border-paper-dark rounded-lg text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40"
              />
              <button type="button" onClick={handleSearch} className="btn-primary shrink-0 px-5">
                帮我选书
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {visibleChips.map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => handleChip(chip)}
                  className="px-2.5 py-1 text-xs border border-accent/25 text-accent rounded-full hover:bg-accent/10 hover:border-accent/50 transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          <Link
            to="/progress"
            className="inline-flex items-center gap-1.5 mt-4 text-accent hover:underline text-xs md:text-sm"
          >
            📍 我看到第 X 章了 — 帮我判断要不要继续
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pt-6 pb-10 space-y-7">
        {sections.map(({ key, title, books }) => {
          if (!books?.length) return null;
          return (
            <div key={key}>
              <h2 className="font-serif text-lg font-semibold text-ink mb-3 flex items-center gap-2">
                <span className="w-1 h-4 bg-accent rounded-full" />
                {title}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    badgeLimit={4}
                    onAddWantToRead={handleWantToRead}
                    isWantToRead={isWantToRead(book.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
