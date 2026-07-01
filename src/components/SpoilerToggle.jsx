import { useState } from 'react';

export default function SpoilerToggle({ lightSpoilerText }) {
  const [open, setOpen] = useState(false);

  if (!lightSpoilerText || lightSpoilerText === '待核验') {
    return <p className="text-xs text-ink-muted italic">轻微剧透：信息待核验</p>;
  }

  return (
    <div className="mt-2">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="text-xs text-accent hover:underline"
        >
          展开轻微剧透提示 ▾
        </button>
      ) : (
        <div className="mt-1 p-2 bg-amber-50/80 border border-amber-200/60 rounded text-xs text-ink-muted leading-relaxed">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-accent hover:underline mb-1 block"
          >
            收起轻微剧透 ▴
          </button>
          {lightSpoilerText}
        </div>
      )}
    </div>
  );
}
