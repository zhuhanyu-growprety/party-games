import { useState } from 'react';
import { Link } from 'react-router-dom';
import RatingBar from '../components/RatingBar';
import { getBooks } from '../lib/books';

export default function ComparePage() {
  const books = getBooks();
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const compareBooks = selected.map((id) => books.find((b) => b.id === id)).filter(Boolean);

  const rows = [
    { label: '类型', get: (b) => (b.basic?.categories || []).join('、') || '待核验' },
    { label: '篇幅', get: (b) => b.basic?.lengthType || '待核验' },
    { label: '慢热程度', get: (b) => b.readingExperience?.slowBurnLevel ?? '待核验', rating: true, field: 'slowBurnLevel' },
    { label: '剧情复杂度', get: (b) => b.readingExperience?.plotComplexity ?? '待核验', rating: true, field: 'plotComplexity' },
    { label: 'CP 权重', get: (b) => b.readingExperience?.romanceWeight ?? '待核验', rating: true, field: 'romanceWeight' },
    { label: '主线权重', get: (b) => b.readingExperience?.plotWeight ?? '待核验', rating: true, field: 'plotWeight' },
    { label: '结局类型', get: (b) => b.basic?.endingType || '待核验' },
    { label: '虐点等级', get: (b) => b.expectationWarnings?.abuseLevel || '待核验' },
    { label: '弃文风险区间', get: (b) => b.readingExperience?.quitRisk?.range || '待核验' },
    { label: '建议坚持到', get: (b) => b.readingExperience?.stickUntil?.displayText || '待核验' },
    { label: '适合人群', get: (b) => (b.readerFit?.suitableFor || []).slice(0, 3).join('、') || '待核验' },
    { label: '不适合人群', get: (b) => (b.readerFit?.notSuitableFor || []).slice(0, 3).join('、') || '待核验' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-serif font-bold text-ink mb-2">小说对比</h1>
      <p className="text-ink-muted text-sm mb-6">选择 2-3 本小说进行横向对比（已选 {selected.length}/3）</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
        {books.map((b) => (
          <label
            key={b.id}
            className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
              selected.includes(b.id)
                ? 'bg-accent/10 border-accent/40'
                : 'bg-card border-paper-dark/60 hover:bg-paper-dark/30'
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(b.id)}
              onChange={() => toggle(b.id)}
              disabled={!selected.includes(b.id) && selected.length >= 3}
              className="accent-accent"
            />
            <span className="text-sm">{b.title}</span>
          </label>
        ))}
      </div>

      {compareBooks.length >= 2 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 bg-paper-dark/40 font-serif">对比项</th>
                {compareBooks.map((b) => (
                  <th key={b.id} className="text-left p-3 bg-paper-dark/40 font-serif min-w-[200px]">
                    <Link to={`/books/${b.id}`} className="text-accent hover:underline">{b.title}</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.label} className="border-t border-paper-dark/40">
                  <td className="p-3 font-medium text-ink-muted">{row.label}</td>
                  {compareBooks.map((b) => (
                    <td key={b.id} className="p-3 text-ink">
                      {row.rating && typeof b.readingExperience?.[row.field] === 'number' ? (
                        <RatingBar label="" value={b.readingExperience[row.field]} />
                      ) : (
                        row.get(b)
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-ink-muted py-8">请至少选择 2 本小说进行对比</p>
      )}
    </div>
  );
}
