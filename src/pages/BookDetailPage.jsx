import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import Badge from '../components/Badge';
import RatingBar from '../components/RatingBar';
import ReaderFitPanel from '../components/ReaderFitPanel';
import WarningPanel from '../components/WarningPanel';
import DropDecisionPanel from '../components/DropDecisionPanel';
import HighlightTimeline from '../components/HighlightTimeline';
import EmptyState from '../components/EmptyState';
import { addRecentView, getBookById, updateBookStatus } from '../lib/books';
import { useReadingState } from '../hooks/useReadingState';

const STATUS_BUTTONS = [
  { key: 'favorites', label: '收藏', icon: '★' },
  { key: 'wantToRead', label: '想读', icon: '♡' },
  { key: 'reading', label: '正在读', icon: '▶' },
  { key: 'finished', label: '已读', icon: '✓' },
  { key: 'dropped', label: '放弃', icon: '✕' },
];

export default function BookDetailPage() {
  const { id } = useParams();
  const book = getBookById(id);
  const { getStatus, refresh } = useReadingState();
  const status = book ? getStatus(book.id) : null;

  useEffect(() => {
    if (book) addRecentView(book.id);
  }, [book]);

  if (!book) {
    return (
      <EmptyState
        title="未找到该小说"
        description="请检查链接是否正确"
        action={<Link to="/books" className="text-accent hover:underline">返回书库</Link>}
      />
    );
  }

  const handleStatus = (s) => {
    updateBookStatus(book.id, status === s ? null : s);
    refresh();
  };

  const exp = book.readingExperience || {};
  const routes = book.routes || {};
  const verification = book.verification || {};

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-7">
      <section className="bg-card border border-paper-dark/60 rounded-xl p-6 shadow-md card-hover">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {(book.frontDisplayBadges || []).map((b) => (
            <Badge key={b}>{b}</Badge>
          ))}
        </div>
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-ink">{book.title}</h1>
        <p className="text-ink-muted mt-1 text-sm">
          {book.author} · {book.platform} · {book.status}
          {book.officialUrl && (
            <> · <a href={book.officialUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">官方链接</a></>
          )}
        </p>
        <p className="mt-4 text-ink leading-relaxed text-sm md:text-base border-l-2 border-accent/30 pl-4">
          {book.hookSummary}
        </p>

        <div className="flex flex-wrap gap-2 mt-5">
          {STATUS_BUTTONS.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => handleStatus(key)}
              className={`px-3 py-1.5 text-sm rounded-md border transition-all ${
                status === key
                  ? 'bg-accent text-white border-accent shadow-sm'
                  : 'border-paper-dark text-ink-muted hover:border-accent/40 hover:text-accent'
              }`}
            >
              {icon} {label}
            </button>
          ))}
          <Link to={`/progress?book=${book.id}`} className="btn-ghost text-sm">
            进度判断
          </Link>
        </div>
      </section>

      <section>
        <h2 className="section-title">适合谁 / 不适合谁</h2>
        {book.readerFit?.oneSentenceIntro && (
          <p className="text-sm text-ink-muted mb-3 italic">{book.readerFit.oneSentenceIntro}</p>
        )}
        <ReaderFitPanel readerFit={book.readerFit} />
      </section>

      <section className="bg-card border border-paper-dark/60 rounded-xl p-6 shadow-sm">
        <h2 className="section-title mb-4">阅读体验评分卡</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <RatingBar label="慢热程度" value={exp.slowBurnLevel} />
          <RatingBar label="剧情复杂度" value={exp.plotComplexity} />
          <RatingBar label="CP / 感情线权重" value={exp.romanceWeight} />
          <RatingBar label="主线权重" value={exp.plotWeight} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3 mt-4 text-sm">
          <div><span className="text-ink-muted">情绪类型：</span>{exp.emotionType || '待核验'}</div>
          <div><span className="text-ink-muted">篇幅：</span>{book.basic?.lengthType || '待核验'}</div>
          <div><span className="text-ink-muted">结局类型：</span>{book.basic?.endingType || '待核验'}</div>
          <div><span className="text-ink-muted">结局置信度：</span>{book.basic?.endingConfidence || '待核验'}</div>
        </div>
      </section>

      <section className="bg-red-50/40 border border-red-200/40 rounded-xl p-6">
        <h2 className="section-title mb-4">弃文风险提示</h2>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">风险区间：</span>{exp.quitRisk?.range || '待核验'}</p>
          <p><span className="font-medium">原因：</span>{exp.quitRisk?.reason || '待核验'}</p>
          <p className="mt-2 p-3 bg-card rounded-lg border border-paper-dark/40">
            <span className="font-medium">建议坚持到：</span>{exp.stickUntil?.displayText || '信息待核验'}
          </p>
        </div>
      </section>

      <section>
        <h2 className="section-title mb-4">弃文决策指南</h2>
        <DropDecisionPanel dropDecision={book.dropDecision} />
      </section>

      <section>
        <h2 className="section-title mb-4">不剧透高光地图</h2>
        <HighlightTimeline highlights={book.highlightMap} />
      </section>

      <section>
        <h2 className="section-title mb-4">阅读预期提醒</h2>
        <WarningPanel warnings={book.expectationWarnings} />
      </section>

      <section className="bg-card border border-paper-dark/60 rounded-xl p-6 shadow-sm">
        <h2 className="section-title mb-4">阅读路线</h2>
        <div className="space-y-3">
          {[
            { key: 'forTrialReader', label: '试读党' },
            { key: 'forPlotReader', label: '剧情党' },
            { key: 'forCPReader', label: 'CP 党' },
            { key: 'ifYouWantToDrop', label: '想弃文时' },
          ].map(({ key, label }) => (
            <div key={key} className="border-l-2 border-accent/40 pl-4">
              <p className="text-sm font-medium text-ink">{label}</p>
              <p className="text-sm text-ink-muted mt-0.5">{routes[key] || '待核验'}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="text-sm text-ink-muted border-t border-paper-dark/40 pt-6">
        <h2 className="font-serif text-lg font-semibold text-ink mb-3">信息置信度</h2>
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <div className="bg-paper-dark/30 rounded-lg p-2 text-center">
            <p className="text-xs text-ink-muted">基础信息</p>
            <p className="font-medium text-ink">{verification.basicInfo || '待核验'}</p>
          </div>
          <div className="bg-paper-dark/30 rounded-lg p-2 text-center">
            <p className="text-xs text-ink-muted">章节节点</p>
            <p className="font-medium text-ink">{verification.chapterNodes || '待核验'}</p>
          </div>
          <div className="bg-paper-dark/30 rounded-lg p-2 text-center">
            <p className="text-xs text-ink-muted">读者讨论</p>
            <p className="font-medium text-ink">{verification.readerDiscussion || '待核验'}</p>
          </div>
        </div>
        {verification.notes?.length > 0 && (
          <ul className="list-disc pl-4 space-y-1">
            {verification.notes.map((n) => <li key={n}>{n}</li>)}
          </ul>
        )}
      </section>
    </div>
  );
}
