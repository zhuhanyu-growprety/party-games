import { Link } from 'react-router-dom';
import Badge from './Badge';

export default function RecommendationCard({ result, onFavorite, isFavorited }) {
  const { book, score, reasons, warnings, stickUntil } = result;

  return (
    <article className="bg-card border border-paper-dark/60 rounded-xl p-5 shadow-sm card-hover">
      <div className="flex justify-between items-start gap-3 mb-3">
        <div>
          <h3 className="text-lg font-serif font-semibold">
            <Link to={`/books/${book.id}`} className="hover:text-accent transition-colors">
              {book.title}
            </Link>
          </h3>
          <p className="text-sm text-ink-muted">{book.author} · {book.platform}</p>
        </div>
        <div className="shrink-0 text-center">
          <span className="block text-2xl font-serif font-bold text-accent tabular-nums">{score}</span>
          <span className="text-xs text-ink-muted">匹配分</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {(book.frontDisplayBadges || []).slice(0, 5).map((b) => (
          <Badge key={b}>{b}</Badge>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3 text-sm">
        <div className="bg-green-50/50 rounded-lg p-3 border border-green-100/60">
          <p className="font-medium text-green-900 mb-1.5 text-xs uppercase tracking-wide">推荐理由</p>
          <ul className="text-ink-muted space-y-1">
            {reasons.map((r) => (
              <li key={r} className="flex gap-1.5">
                <span className="text-green-600 shrink-0">+</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-amber-50/50 rounded-lg p-3 border border-amber-100/60">
          <p className="font-medium text-amber-900 mb-1.5 text-xs uppercase tracking-wide">可能劝退点</p>
          <ul className="text-ink-muted space-y-1">
            {warnings.map((w) => (
              <li key={w} className="flex gap-1.5">
                <span className="text-amber-600 shrink-0">!</span>
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="text-sm text-ink-muted mt-3 p-2.5 bg-paper-dark/30 rounded-lg">
        <span className="font-medium text-ink">建议试读到：</span>{stickUntil}
      </p>

      <div className="flex gap-2 mt-4">
        <Link to={`/books/${book.id}`} className="btn-primary flex-1 text-center">
          查看入坑地图
        </Link>
        {onFavorite && (
          <button
            type="button"
            onClick={() => onFavorite(book.id)}
            disabled={isFavorited}
            className={`px-4 text-sm rounded-md border transition-all ${
              isFavorited
                ? 'border-green-300 bg-green-50 text-green-800'
                : 'btn-secondary'
            }`}
          >
            {isFavorited ? '✓ 已收藏' : '收藏'}
          </button>
        )}
      </div>
    </article>
  );
}
