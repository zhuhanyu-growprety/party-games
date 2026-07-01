import { Link } from 'react-router-dom';
import BookCard from '../components/BookCard';
import EmptyState from '../components/EmptyState';
import { getBookById } from '../lib/books';
import { useReadingState } from '../hooks/useReadingState';

function BookList({ ids, emptyTitle, emptyDesc, action }) {
  const books = ids.map((id) => getBookById(id)).filter(Boolean);
  if (!books.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDesc}
        action={action}
      />
    );
  }
  return (
    <div className="grid md:grid-cols-2 gap-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} showActions={false} />
      ))}
    </div>
  );
}

export default function FavoritesPage() {
  const { state } = useReadingState();

  const sections = [
    { key: 'wantToRead', title: '我的想读', empty: '还没有想读的书', desc: '在书库点击「加入想读」即可添加' },
    { key: 'reading', title: '正在读', empty: '还没有标记正在读的书', desc: '在详情页标记「正在读」' },
    { key: 'finished', title: '已读', empty: '还没有标记已读的书', desc: '读完后可在详情页标记' },
    { key: 'dropped', title: '已放弃', empty: '还没有放弃的书', desc: '决定弃文后可在详情页标记' },
  ];

  const progressEntries = Object.entries(state.progress || {});

  const browseLink = (
    <Link to="/books" className="text-accent hover:underline text-sm">去书库逛逛 →</Link>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-ink mb-1">我的书架</h1>
        <p className="text-ink-muted text-sm">数据保存在本地浏览器，无需登录</p>
      </div>

      {state.favorites?.length > 0 && (
        <section>
          <h2 className="font-serif text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-accent rounded-full" />收藏
          </h2>
          <BookList ids={state.favorites} emptyTitle="无收藏" emptyDesc="" />
        </section>
      )}

      {sections.map(({ key, title, empty, desc }) => (
        <section key={key}>
          <h2 className="font-serif text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-accent rounded-full" />
            {title}
            <span className="text-xs font-normal text-ink-muted">({(state[key] || []).length})</span>
          </h2>
          <BookList
            ids={state[key] || []}
            emptyTitle={empty}
            emptyDesc={desc}
            action={browseLink}
          />
        </section>
      ))}

      <section>
        <h2 className="font-serif text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-accent rounded-full" />
          最近浏览
          <span className="text-xs font-normal text-ink-muted">({(state.recentViews || []).length})</span>
        </h2>
        <BookList
          ids={state.recentViews || []}
          emptyTitle="还没有浏览记录"
          emptyDesc="打开小说详情页后会自动记录"
          action={browseLink}
        />
      </section>

      {progressEntries.length > 0 && (
        <section>
          <h2 className="font-serif text-lg font-semibold mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-accent rounded-full" />继续上次判断
          </h2>
          <div className="space-y-2">
            {progressEntries.map(([bookId, prog]) => {
              const book = getBookById(bookId);
              if (!book) return null;
              return (
                <Link
                  key={bookId}
                  to={`/progress?book=${bookId}`}
                  className="flex items-center justify-between bg-card border border-paper-dark/60 rounded-xl p-4 card-hover"
                >
                  <div>
                    <p className="font-medium text-ink font-serif">{book.title}</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {prog.chapter ? `第 ${prog.chapter} 章` : ''}
                      {prog.progressRange ? `${prog.chapter ? ' · ' : ''}${prog.progressRange}` : ''}
                    </p>
                  </div>
                  <span className="text-accent text-sm shrink-0">继续判断 →</span>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
