export default function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-bookmark/15 text-ink-muted border-bookmark/35 bookmark-tag',
    accent: 'bg-accent/12 text-accent border-accent/25 bookmark-tag',
    warning: 'bg-amber-50 text-amber-900 border-amber-200/60',
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded border ${variants[variant] || variants.default}`}
    >
      {children}
    </span>
  );
}
