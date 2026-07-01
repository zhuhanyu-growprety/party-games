export default function DropDecisionPanel({ dropDecision }) {
  if (!dropDecision) return <p className="text-ink-muted text-sm">弃文决策信息待核验</p>;

  const items = [
    { title: '刚开始读不下去', content: dropDecision.ifAtBeginning },
    { title: '卡在弃文风险区', content: dropDecision.ifAtQuitRiskRange },
    { title: '可以合理放弃的时机', content: dropDecision.safeToDropAfter },
  ];

  return (
    <div className="space-y-3">
      {items.map(({ title, content }) => (
        <div key={title} className="bg-card border border-paper-dark/50 rounded-lg p-4">
          <h4 className="font-serif font-medium text-ink mb-1">{title}</h4>
          <p className="text-sm text-ink-muted leading-relaxed">{content || '待核验'}</p>
        </div>
      ))}
    </div>
  );
}
