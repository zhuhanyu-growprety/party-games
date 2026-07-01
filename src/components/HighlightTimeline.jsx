import Badge from './Badge';
import SpoilerToggle from './SpoilerToggle';

export default function HighlightTimeline({ highlights = [] }) {
  if (!highlights.length) {
    return <p className="text-ink-muted text-sm">高光地图信息待核验</p>;
  }

  return (
    <div className="relative pl-8 space-y-5">
      <div className="absolute left-[11px] top-3 bottom-3 w-0.5 timeline-line rounded-full" />
      {highlights.map((item, idx) => (
        <div key={idx} className="relative">
          <div className="absolute -left-8 top-4 w-[22px] h-[22px] rounded-full bg-card border-2 border-accent shadow-sm flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-accent" />
          </div>
          <div className="bg-card border border-paper-dark/50 rounded-xl p-4 shadow-sm card-hover ml-1">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-white bg-accent px-2.5 py-0.5 rounded-full">
                {item.progressRange}
              </span>
              {item.stageName && item.stageName !== item.type && (
                <span className="text-sm font-serif font-medium text-ink">{item.stageName}</span>
              )}
              {item.type && <Badge variant="accent">{item.type}</Badge>}
              {item.importance != null && (
                <span className="text-xs text-ink-muted ml-auto">重要度 {'★'.repeat(item.importance)}</span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-ink">{item.spoilerFreeText}</p>
            <SpoilerToggle lightSpoilerText={item.lightSpoilerText} />
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {item.emotion?.map((e) => (
                <Badge key={e}>{e}</Badge>
              ))}
              {item.confidence && (
                <span className="text-xs text-ink-muted ml-auto">置信度：{item.confidence}</span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
