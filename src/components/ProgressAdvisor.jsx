import { getProgressAdvice, getProgressRanges, saveProgress } from '../lib/books';
import { useState } from 'react';

export default function ProgressAdvisor({ book, savedProgress, onSave }) {
  const [chapter, setChapter] = useState(savedProgress?.chapter || '');
  const [manualRange, setManualRange] = useState(savedProgress?.progressRange || '');
  const [advice, setAdvice] = useState(null);

  const total = book?.basic?.totalChapters;
  const hasChapterCount = typeof total === 'number';

  const handleAnalyze = () => {
    if (!book) return;
    if (!hasChapterCount && !manualRange) return;
    if (hasChapterCount && !chapter && !manualRange) return;

    const input = {
      chapter: chapter ? Number(chapter) : null,
      progressRange: manualRange || null,
    };
    const result = getProgressAdvice(book, input);
    setAdvice(result);
    if (result.range && onSave) {
      onSave({ chapter: input.chapter, progressRange: result.range });
    }
    if (result.range) {
      saveProgress(book.id, { chapter: input.chapter, progressRange: result.range });
    }
  };

  if (!book) return null;

  const canAnalyze = hasChapterCount ? (chapter || manualRange) : manualRange;

  return (
    <div className="space-y-4">
      {hasChapterCount ? (
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            当前读到第几章？
          </label>
          <p className="text-xs text-ink-muted mb-2">全书约 {total} 章，输入章节号可自动计算进度</p>
          <input
            type="number"
            min="1"
            max={total}
            value={chapter}
            onChange={(e) => setChapter(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-paper-dark rounded-lg focus:ring-2 focus:ring-accent/30 outline-none"
            placeholder={`1 – ${total}`}
          />
        </div>
      ) : (
        <div className="bg-amber-50/70 border border-amber-200/60 rounded-lg p-3 text-sm text-amber-900">
          <span className="font-medium">提示：</span>该书章节数待核验，请选择进度区间进行判断
        </div>
      )}

      {(!hasChapterCount || !chapter) && (
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            {hasChapterCount ? '或手动选择进度区间' : '选择当前进度区间'}
          </label>
          <select
            value={manualRange}
            onChange={(e) => setManualRange(e.target.value)}
            className="w-full px-3 py-2.5 bg-card border border-paper-dark rounded-lg focus:ring-2 focus:ring-accent/30 outline-none"
          >
            <option value="">请选择...</option>
            {getProgressRanges().map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      )}

      <button
        type="button"
        onClick={handleAnalyze}
        disabled={!canAnalyze}
        className="w-full btn-primary py-2.5 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        获取阅读建议
      </button>

      {advice && (
        <div className="bg-card border border-paper-dark/60 rounded-xl p-5 shadow-sm space-y-4">
          {advice.needsManualRange && !advice.range ? (
            <p className="text-ink-muted text-sm">{advice.message}</p>
          ) : (
            <>
              <div className="border-b border-paper-dark/40 pb-4">
                <p className="text-xs text-accent font-medium mb-1">阅读助手</p>
                <p className="font-serif text-base text-ink leading-relaxed">{advice.headline}</p>
                {advice.chapterInfo && (
                  <div className="mt-2">
                    <div className="reading-bar h-2">
                      <div
                        className="reading-bar-fill"
                        style={{ width: `${advice.chapterInfo.pct}%` }}
                      />
                    </div>
                    <p className="text-xs text-ink-muted mt-1">
                      第 {advice.chapterInfo.chapter} / {advice.chapterInfo.total} 章
                    </p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-ink mb-1">这个阶段你会感受到</p>
                <p className="text-sm text-ink-muted leading-relaxed">{advice.currentExperience}</p>
                {advice.emotions?.length > 0 && (
                  <p className="text-xs text-ink-muted mt-1.5">
                    常见情绪：{advice.emotions.join(' · ')}
                  </p>
                )}
              </div>

              <div className="bg-paper-dark/30 rounded-lg p-3">
                <p className="text-sm font-medium text-ink mb-1">接下来值得期待</p>
                <p className="text-sm text-ink-muted leading-relaxed">{advice.nextParagraph}</p>
              </div>

              <div className={`rounded-lg p-3 text-sm ${advice.inQuitRisk ? 'bg-red-50/70 border border-red-200/50' : 'bg-green-50/60 border border-green-200/50'}`}>
                <p className="font-medium mb-1">{advice.riskParagraph}</p>
              </div>

              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                <p className="text-sm font-serif font-medium text-accent mb-2">{advice.verdictLabel}</p>
                <p className="text-sm text-ink leading-relaxed">{advice.dropAdvice}</p>
                {advice.stickUntil && (
                  <p className="text-xs text-ink-muted mt-2 pt-2 border-t border-accent/10">
                    💡 {advice.stickUntil}
                  </p>
                )}
              </div>

              {advice.canSafelyDrop && (
                <p className="text-xs text-ink-muted italic text-center">
                  如果到此仍完全无感，可以合理考虑放弃——不必勉强。
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
