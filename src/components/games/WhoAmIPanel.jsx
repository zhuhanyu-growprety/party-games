import { useRef, useState } from 'react';
import bank from '../../data/gameBanks/whoAmI.v1.json';
import { getGameRules } from '../../lib/gameRules';

const FOOTER = '大家只能用提示和回答帮助猜身份，不要直接念出答案。';

function pickCard(pool, lastId) {
  if (!pool.length) return null;
  if (pool.length === 1) return pool[0];
  let item = pool[Math.floor(Math.random() * pool.length)];
  if (item.id === lastId) {
    const alt = pool.filter((c) => c.id !== lastId);
    if (alt.length) item = alt[Math.floor(Math.random() * alt.length)];
  }
  return item;
}

export default function WhoAmIPanel({ game }) {
  const rules = getGameRules('whoami');
  const lastIdRef = useRef(null);
  const [card, setCard] = useState(null);
  const [hidden, setHidden] = useState(false);

  function drawCard() {
    const item = pickCard(bank.cards, lastIdRef.current);
    if (!item) return;
    lastIdRef.current = item.id;
    setCard(item);
    setHidden(false);
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
        <h3 className="lite-tool-title">身份卡</h3>
        <p className="lite-tool-hint">把手机举给其他玩家看，抽卡的人不要偷看屏幕。</p>

        {!card ? (
          <p className="lite-tool-empty">还没有身份卡，抽一张让大家猜。</p>
        ) : (
          <div className="lite-tool-card">
            {hidden ? (
              <p className="lite-tool-hidden">身份已隐藏</p>
            ) : (
              <>
                <p className="lite-tool-identity">{card.text}</p>
                <p className="lite-tool-meta">分类：{card.category}</p>
              </>
            )}
          </div>
        )}

        <div className="lite-tool-actions">
          <button type="button" className="btn btn-primary lite-tool-btn" onClick={drawCard}>
            抽一张身份
          </button>
          <button type="button" className="btn btn-secondary lite-tool-btn" onClick={drawCard} disabled={!card}>
            换一张
          </button>
          {card && (
            <button
              type="button"
              className="btn btn-ghost lite-tool-btn"
              onClick={() => setHidden((v) => !v)}
            >
              {hidden ? '显示身份' : '隐藏身份'}
            </button>
          )}
        </div>

        <p className="lite-tool-footer">{FOOTER}</p>
      </section>
    </div>
  );
}
