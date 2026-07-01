export default function EmptyState({ title, description, action }) {
  return (
    <div className="text-center py-12 px-4">
      <div className="text-4xl mb-3 opacity-40">📖</div>
      <h3 className="font-serif text-lg text-ink mb-2">{title}</h3>
      <p className="text-sm text-ink-muted mb-4 max-w-md mx-auto">{description}</p>
      {action}
    </div>
  );
}
