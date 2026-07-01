export default function BookSelector({ books, value, onChange, label = '选择小说' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-ink-muted mb-1">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-card border border-paper-dark rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        <option value="">请选择...</option>
        {books.map((b) => (
          <option key={b.id} value={b.id}>
            {b.title} — {b.author}
          </option>
        ))}
      </select>
    </div>
  );
}
