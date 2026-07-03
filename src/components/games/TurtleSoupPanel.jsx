import { useRef, useState } from 'react';
import bank from '../../data/gameBanks/turtleSoup.v1.json';
import { getGameRules } from '../../lib/gameRules';

const FOOTER = '汤底由主持人保管，玩家通过提问慢慢还原真相。';
const DIFF_LABELS = { easy: '轻松', medium: '中等', hard: '烧脑' };

function pickCase(pool, lastId) {
  if (!pool.length) return null;
  if (pool.length === 1) return pool[0];
  let item = pool[Math.floor(Math.random() * pool.length)];
  if (item.id === lastId) {
    const alt = pool.filter((c) => c.id !== lastId);
    if (alt.length) item = alt[Math.floor(Math.random() * alt.length)];
  }
  return item;
}

export default function TurtleSoupPanel({ game }) {
  const rules = getGameRules('turtle-soup');
  const lastIdRef = useRef(null);
  const [current, setCurrent] = useState(null);
  const [hostView, setHostView] = useState('hidden');

  function drawCase() {
    const item = pickCase(bank.cases, lastIdRef.current);
    if (!item) return;
    lastIdRef.current = item.id;
    setCurrent(item);
    setHostView('hidden');
  }

  return (
    <div className="game-panel rules-panel lite-tool-panel">
      <div className="rules-panel-header">
        {game.image && (
          <img className="rules-panel-thumb" src={game.image} alt="" aria-hidden="true" />
        )}
        <div className="rules-panel-intro">
          <h2>{rules?.title ?? game.title}</h2>
          <p className="rules-panel-summary">{rules?.summary ?? game.shortIntro}</p>
          <span className="rules-panel-range">{rules?.players ?? game.playerRange}</span>
        </div>
      </div>

      <section className="lite-tool-play">
        <h3 className="lite-tool-title">汤面区</h3>
        <p className="lite-tool-hint">玩家只看汤面；主持人可以查看提示和汤底，回答「是 / 不是 / 不重要」。</p>

        {!current ? (
          <p className="lite-tool-empty">还没有抽汤面，先来一碗轻悬疑。</p>
        ) : (
          <div className="lite-tool-card">
            <p className="lite-tool-case-title">{current.title}</p>
            <p className="lite-tool-case-setup">{current.setup}</p>
            <p className="lite-tool-meta">
              难度：{DIFF_LABELS[current.difficulty] ?? current.difficulty}
              {current.tags?.length ? ` · ${current.tags.join(' / ')}` : ''}
            </p>
          </div>
        )}

        <div className="lite-tool-actions">
          <button type="button" className="btn btn-primary lite-tool-btn" onClick={drawCase}>
            抽一碗汤
          </button>
          <button type="button" className="btn btn-secondary lite-tool-btn" onClick={drawCase} disabled={!current}>
            换一碗汤
          </button>
        </div>

        {current && (
          <div className="lite-tool-host">
            <p className="lite-tool-host-label">主持人区域</p>
            <div className="lite-tool-actions lite-tool-actions--row">
              <button type="button" className="btn btn-ghost lite-tool-btn" onClick={() => setHostView('hints')}>
                查看提示
              </button>
              <button type="button" className="btn btn-ghost lite-tool-btn" onClick={() => setHostView('answer')}>
                查看汤底
              </button>
              <button type="button" className="btn btn-ghost lite-tool-btn" onClick={() => setHostView('hidden')}>
                隐藏主持人区
              </button>
            </div>
            {hostView === 'hints' && (
              <ul className="rules-card-list">
                {current.hints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            )}
            {hostView === 'answer' && (
              <p className="lite-tool-answer">{current.answer}</p>
            )}
          </div>
        )}

        <p className="lite-tool-footer">{FOOTER}</p>
      </section>
    </div>
  );
}
