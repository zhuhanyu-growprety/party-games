export default function WarningPanel({ warnings }) {
  if (!warnings) return <p className="text-ink-muted text-sm">阅读预期提醒待核验</p>;

  const items = [
    { label: '慢热程度', value: warnings.slowBurn },
    { label: '虐点等级', value: warnings.abuseLevel },
    { label: '误会程度', value: warnings.misunderstandingLevel },
    { label: '结局顾虑', value: warnings.endingConcern },
    { label: '争议点', value: warnings.controversy },
  ];

  return (
    <div className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        {items.map(({ label, value }) => (
          <div key={label} className="bg-amber-50/60 border border-amber-200/40 rounded-lg p-3">
            <p className="text-xs text-amber-800/70 mb-0.5">{label}</p>
            <p className="text-sm text-ink">{value || '待核验'}</p>
          </div>
        ))}
      </div>
      {warnings.otherWarnings?.length > 0 && (
        <ul className="text-sm text-ink-muted space-y-1 pl-4 list-disc">
          {warnings.otherWarnings.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
