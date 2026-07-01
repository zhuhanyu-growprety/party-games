import { Link } from 'react-router-dom';
import Badge from './Badge';
import RatingBar from './RatingBar';

export default function BookCard({
  book,
  onAddWantToRead,
  showActions = true,
  isWantToRead = false,
  badgeLimit = 5,
}) {
  const badges = (book.frontDisplayBadges || []).slice(0, badgeLimit);

  return (
    <article className="bg-card rounded-xl border border-paper-dark/50 shadow-sm card-hover p-0 flex flex-col overflow-hidden">
      {/* 标题区 */}
      <div className="px-4 pt-4 pb-2 border-b border-paper-dark/30">
        <h3 className="text-base font-serif font-semibold text-ink leading-snug">
          <Link to={`/books/${book.id}`} className="hover:text-accent transition-colors">
            {book.title}
          </Link>
        </h3>
        <p className="text-xs text-ink-muted mt-1">
          {book.author} · {book.platform} · {book.status}
        </p>
      </div>

      {/* 简介 */}
      <div className="px-4 py-3 flex-1">
        <p className="text-sm text-ink-muted leading-relaxed line-clamp-2">{book.hookSummary}</p>
      </div>

      {/* 标签 */}
      <div className="px-4 pb-2 flex flex-wrap gap-1">
        {badges.map((b) => (
          <Badge key={b}>{b}</Badge>
        ))}
      </div>

      {/* 元信息 + 评分 */}
      <div className="px-4 pb-3 space-y-2.5">
        <div className="flex gap-3 text-xs text-ink-muted">
          <span>{book.basic?.lengthType || '篇幅待核验'}</span>
          <span className="text-paper-dark">|</span>
          <span>{book.basic?.endingType || '结局待核验'}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
          <RatingBar label="慢热" value={book.readingExperience?.slowBurnLevel} compact />
          <RatingBar label="复杂度" value={book.readingExperience?.plotComplexity} compact />
        </div>
        {book.readerFit?.suitableFor?.length > 0 && (
          <p className="text-xs text-ink-muted/80 line-clamp-1">
            适合 {book.readerFit.suitableFor.slice(0, 3).join('、')}
          </p>
        )}
      </div>

      {/* 操作 */}
      {showActions && (
        <div className="flex gap-2 px-4 py-3 bg-paper-dark/20 border-t border-paper-dark/30 mt-auto">
          <Link to={`/books/${book.id}`} className="btn-primary flex-1 text-center">
            查看入坑地图
          </Link>
          {onAddWantToRead && (
            <button
              type="button"
              onClick={() => onAddWantToRead(book.id)}
              disabled={isWantToRead}
              className={`shrink-0 px-3 text-sm rounded-md border transition-all ${
                isWantToRead
                  ? 'border-green-300/60 bg-green-50/80 text-green-800 cursor-default'
                  : 'btn-secondary'
              }`}
            >
              {isWantToRead ? '✓ 想读' : '加入想读'}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
