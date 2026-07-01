import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { filterBooks, getBooksCount, getFilterOptions, updateBookStatus } from '../lib/books';
import { useReadingState } from '../hooks/useReadingState';

export default function BooksPage() {
  const [searchParams] = useSearchParams();
  const { isWantToRead } = useReadingState();

  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [badge, setBadge] = useState(searchParams.get('badge') || '');
  const [slowBurn, setSlowBurn] = useState('');
  const [romance, setRomance] = useState('');
  const [plot, setPlot] = useState('');
  const [sortBy, setSortBy] = useState('');

  const { categories, badges } = getFilterOptions();
  const totalCount = getBooksCount();

  const books = useMemo(() => {
    const filters = {};
    if (category) filters.category = category;
    if (badge) filters.badge = badge;
    if (slowBurn.startsWith('max')) filters.slowBurnMax = Number(slowBurn.slice(3));
    if (slowBurn.startsWith('min')) filters.slowBurnMin = Number(slowBurn.slice(3));
    if (slowBurn.startsWith('eq')) filters.slowBurnMin = filters.slowBurnMax = Number(slowBurn.slice(2));
    if (romance.startsWith('min')) filters.romanceMin = Number(romance.slice(3));
    if (romance.startsWith('max')) filters.romanceMax = Number(romance.slice(3));
    if (plot.startsWith('min')) filters.plotMin = Number(plot.slice(3));
    if (sortBy) filters.sortBy = sortBy;
    return filterBooks(filters);
  }, [category, badge, slowBurn, romance, plot, sortBy]);

  const handleWantToRead = (id) => {
    if (!isWantToRead(id)) updateBookStatus(id, 'wantToRead');
  };

  const hasFilters = category || badge || slowBurn || romance || plot;

  const clearFilters = () => {
    setCategory('');
    setBadge('');
    setSlowBurn('');
    setRomance('');
    setPlot('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold text-ink mb-1">小说书库</h1>
      <p className="text-ink-muted text-sm mb-5">
        书库共 {totalCount} 本{hasFilters ? `，当前筛选 ${books.length} 本` : ''}
        {hasFilters && (
          <button type="button" onClick={clearFilters} className="ml-2 text-accent hover:underline">
            清除筛选
          </button>
        )}
      </p>

      <div className="bg-card border border-paper-dark/60 rounded-xl p-4 mb-5 shadow-sm">
        <p className="text-xs font-medium text-ink-muted mb-2">筛选与排序</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 bg-paper border border-paper-dark rounded-md text-sm focus:ring-2 focus:ring-accent/30 outline-none">
            <option value="">全部类型</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={badge} onChange={(e) => setBadge(e.target.value)} className="px-3 py-2 bg-paper border border-paper-dark rounded-md text-sm focus:ring-2 focus:ring-accent/30 outline-none">
            <option value="">全部标签</option>
            {badges.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
          <select value={slowBurn} onChange={(e) => setSlowBurn(e.target.value)} className="px-3 py-2 bg-paper border border-paper-dark rounded-md text-sm focus:ring-2 focus:ring-accent/30 outline-none">
            <option value="">慢热程度</option>
            <option value="max2">慢热 ≤2（快节奏）</option>
            <option value="max3">慢热 ≤3</option>
            <option value="min4">慢热 ≥4（慢热型）</option>
            <option value="eq5">慢热 =5</option>
          </select>
          <select value={romance} onChange={(e) => setRomance(e.target.value)} className="px-3 py-2 bg-paper border border-paper-dark rounded-md text-sm focus:ring-2 focus:ring-accent/30 outline-none">
            <option value="">CP / 感情线</option>
            <option value="min4">CP 权重 ≥4</option>
            <option value="min3">CP 权重 ≥3</option>
            <option value="max2">CP 权重 ≤2（非恋爱向）</option>
          </select>
          <select value={plot} onChange={(e) => setPlot(e.target.value)} className="px-3 py-2 bg-paper border border-paper-dark rounded-md text-sm focus:ring-2 focus:ring-accent/30 outline-none">
            <option value="">主线权重</option>
            <option value="min5">主线 =5</option>
            <option value="min4">主线 ≥4</option>
            <option value="min3">主线 ≥3</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 bg-paper border border-paper-dark rounded-md text-sm focus:ring-2 focus:ring-accent/30 outline-none">
            <option value="">排序方式</option>
            <option value="slowBurnAsc">慢热程度低到高</option>
            <option value="plotComplexityAsc">剧情复杂度低到高</option>
            <option value="romanceDesc">CP 权重高到低</option>
            <option value="plotDesc">主线权重高到低</option>
          </select>
        </div>
      </div>

      {books.length === 0 ? (
        <p className="text-center text-ink-muted py-12">没有符合筛选条件的书，试试放宽条件</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onAddWantToRead={handleWantToRead}
              isWantToRead={isWantToRead(book.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
