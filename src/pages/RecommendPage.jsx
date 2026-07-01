import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import RecommendationCard from '../components/RecommendationCard';
import { recommendBooks, updateBookStatus } from '../lib/books';
import { useReadingState } from '../hooks/useReadingState';

export default function RecommendPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getStatus, refresh } = useReadingState();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [result, setResult] = useState(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      setResult(recommendBooks(q, 5));
    }
  }, [searchParams]);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearchParams({ q: query.trim() });
    setResult(recommendBooks(query.trim(), 5));
  };

  const handleFavorite = (id) => {
    updateBookStatus(id, 'favorites');
    refresh();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold text-ink mb-1">智能推荐</h1>
      <p className="text-ink-muted text-sm mb-5">用自然语言描述偏好，系统基于标签、类型和阅读体验为你匹配</p>

      <div className="bg-card border border-paper-dark/60 rounded-xl p-4 mb-6 shadow-sm">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="例如：我想看恋爱向但不要太虐的长篇"
            className="flex-1 px-4 py-2.5 bg-paper border border-paper-dark rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          <button type="button" onClick={handleSearch} className="btn-primary px-5">
            推荐
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-5">
          <div className="bg-gradient-to-r from-accent/10 to-paper-dark/40 rounded-xl p-4 border border-accent/20">
            <h2 className="font-serif font-medium text-ink mb-2 text-sm">我理解到你的偏好</h2>
            <div className="flex flex-wrap gap-2">
              {result.detectedPrefs.map((p) => (
                <span key={p} className="px-3 py-1 bg-card text-accent text-sm rounded-full border border-accent/25 shadow-sm">
                  {p}
                </span>
              ))}
            </div>
            {query && (
              <p className="text-xs text-ink-muted mt-2">搜索：「{query}」· 共 {result.results.length} 条推荐</p>
            )}
          </div>

          <div className="space-y-4">
            {result.results.map((r, i) => (
              <div key={r.book.id} className="relative">
                {i < 3 && (
                  <span className="absolute -left-1 -top-1 z-10 w-6 h-6 bg-accent text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                    {i + 1}
                  </span>
                )}
                <RecommendationCard
                  result={r}
                  onFavorite={handleFavorite}
                  isFavorited={getStatus(r.book.id) === 'favorites'}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {!result && (
        <p className="text-center text-ink-muted text-sm py-8">
          输入你的阅读偏好后点击推荐，或从首页快捷标签进入
        </p>
      )}
    </div>
  );
}
