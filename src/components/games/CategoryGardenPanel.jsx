import { useRef, useState } from 'react';
import bank from '../../data/gameBanks/categoryGarden.v1.json';
import { getGameRules } from '../../lib/gameRules';

const FOOTER =
  '卡壳或重复的人完成一个提前约定的轻量挑战：好笑可以，危险和冒犯不行。';

function pickTopic(pool, lastId) {
  if (!pool.length) return null;
  if (pool.length === 1) return pool[0];
  let item = pool[Math.floor(Math.random() * pool.length)];
  if (item.id === lastId) {
    const alt = pool.filter((t) => t.id !== lastId);
    if (alt.length) item = alt[Math.floor(Math.random() * alt.length)];
  }
  return item;
}

export default function CategoryGardenPanel({ game }) {
  const rules = getGameRules('garden');
  const lastIdRef = useRef(null);
  const [topic, setTopic] = useState(null);

  function drawTopic() {
    const item = pickTopic(bank.topics, lastIdRef.current);
    if (!item) return;
    lastIdRef.current = item.id;
    setTopic(item);
  }

  return (
    <div className="game-panel rules-panel lite-tool-panel">
      <PanelHeader game={game} rules={rules} />
      <section className="lite-tool-play">
        <h3 className="lite-tool-title">逛园区</h3>
        {!topic ? (
          <p className="lite-tool-empty">还没有抽主题，点一下开始逛园。</p>
        ) : (
          <div className="lite-tool-card">
            <p className="lite-tool-row"><span>主题</span>{topic.title}</p>
            <p className="lite-tool-row"><span>任务</span>{topic.prompt}</p>
            <p className="lite-tool-row"><span>参考</span>{topic.examples.join(' / ')}</p>
          </div>
        )}
        <div className="lite-tool-actions">
          <button type="button" className="btn btn-primary lite-tool-btn" onClick={drawTopic}>
            抽一个主题
          </button>
          <button type="button" className="btn btn-secondary lite-tool-btn" onClick={drawTopic} disabled={!topic}>
            换一个主题
          </button>
        </div>
        <p className="lite-tool-footer">{FOOTER}</p>
      </section>
    </div>
  );
}

function PanelHeader({ game, rules }) {
  return (
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
  );
}
