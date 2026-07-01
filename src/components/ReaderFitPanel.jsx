export default function ReaderFitPanel({ readerFit }) {
  if (!readerFit) return <p className="text-ink-muted text-sm">读者适配信息待核验</p>;

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="bg-green-50/50 border border-green-200/50 rounded-lg p-4">
        <h4 className="font-serif font-medium text-green-900 mb-2">适合谁</h4>
        <ul className="space-y-1">
          {(readerFit.suitableFor || []).map((item) => (
            <li key={item} className="text-sm text-green-800 flex items-start gap-2">
              <span className="text-green-600">✓</span> {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-red-50/40 border border-red-200/40 rounded-lg p-4">
        <h4 className="font-serif font-medium text-red-900 mb-2">不适合谁</h4>
        <ul className="space-y-1">
          {(readerFit.notSuitableFor || []).map((item) => (
            <li key={item} className="text-sm text-red-800 flex items-start gap-2">
              <span className="text-red-500">✗</span> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
