export default function RatingBar({ label, value, max = 5, compact = false }) {
  const display = value != null ? value : '待核验';
  const pct = typeof value === 'number' ? (value / max) * 100 : 0;

  if (compact && !label) {
    return (
      <div className="reading-bar">
        <div className="reading-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    );
  }

  return (
    <div className={compact ? 'space-y-0.5' : 'space-y-1'}>
      {label && (
        <div className="flex justify-between text-xs">
          <span className="text-ink-muted">{label}</span>
          <span className="font-medium text-ink tabular-nums">
            {display}{typeof value === 'number' ? `/${max}` : ''}
          </span>
        </div>
      )}
      <div className="reading-bar">
        <div className="reading-bar-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
