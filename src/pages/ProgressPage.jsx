import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookSelector from '../components/BookSelector';
import ProgressAdvisor from '../components/ProgressAdvisor';
import { getBooks, getReadingState, searchBooksByTitleOrAuthor } from '../lib/books';

export default function ProgressPage() {
  const [searchParams] = useSearchParams();
  const books = getBooks();
  const [bookId, setBookId] = useState(searchParams.get('book') || '');
  const [bookFilter, setBookFilter] = useState('');
  const [savedProgress, setSavedProgress] = useState(null);

  const filteredBooks = useMemo(() => {
    const matched = searchBooksByTitleOrAuthor(bookFilter, books);
    if (!bookId) return matched;
    const selected = books.find((b) => b.id === bookId);
    if (selected && !matched.some((b) => b.id === bookId)) {
      return [selected, ...matched];
    }
    return matched;
  }, [bookFilter, books, bookId]);

  const book = books.find((b) => b.id === bookId);
  const hasFilter = bookFilter.trim().length > 0;
  const noMatches = hasFilter && searchBooksByTitleOrAuthor(bookFilter, books).length === 0;

  useEffect(() => {
    if (bookId) {
      const state = getReadingState();
      setSavedProgress(state.progress[bookId] || null);
    }
  }, [bookId]);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold text-ink mb-2">阅读进度判断</h1>
      <p className="text-ink-muted text-sm mb-6">
        告诉我你读到哪里了，帮你判断要不要继续、后面有什么值得期待
      </p>

      <div className="bg-card border border-paper-dark/60 rounded-xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-ink-muted mb-1">搜索书名或作者</label>
          <input
            type="text"
            value={bookFilter}
            onChange={(e) => setBookFilter(e.target.value)}
            placeholder="例如：白日梦我、栖见、阿基米德"
            className="w-full px-3 py-2 bg-paper border border-paper-dark rounded-md text-sm text-ink placeholder:text-ink-muted/50 focus:outline-none focus:ring-2 focus:ring-accent/40"
          />
          {noMatches && (
            <p className="text-sm text-ink-muted mt-2">没有找到匹配小说，请换个关键词试试</p>
          )}
        </div>

        <BookSelector books={filteredBooks} value={bookId} onChange={setBookId} />

        {book && (
          <ProgressAdvisor
            book={book}
            savedProgress={savedProgress}
            onSave={setSavedProgress}
          />
        )}
      </div>
    </div>
  );
}
