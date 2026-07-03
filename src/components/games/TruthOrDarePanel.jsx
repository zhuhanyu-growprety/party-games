import { useRef, useState } from 'react';
import bank from '../../data/gameBanks/truthOrDare.v1.json';
import { getGameRules } from '../../lib/gameRules';

const TYPE_LABELS = {
  truth: '真心话',
  dare: '大冒险',
};

function pickFromPool(pool, lastId) {
  if (!pool.length) return null;
  if (pool.length === 1) return pool[0];

  let item = pool[Math.floor(Math.random() * pool.length)];
  if (item.id === lastId) {
    const alternatives = pool.filter((entry) => entry.id !== lastId);
    if (alternatives.length) {
      item = alternatives[Math.floor(Math.random() * alternatives.length)];
    }
  }
  return item;
}

export default function TruthOrDarePanel({ game }) {
  const rules = getGameRules('truth-dare');
  const lastIdRef = useRef(null);
  const [currentType, setCurrentType] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);

  function draw(type) {
    const pool = type === 'truth' ? bank.truthQuestions : bank.dareTasks;
    const item = pickFromPool(pool, lastIdRef.current);
    if (!item) return;

    lastIdRef.current = item.id;
    setCurrentType(type);
    setCurrentItem(item);
  }

  function handlePickTruth() {
    draw('truth');
  }

  function handlePickDare() {
    draw('dare');
  }

  function handlePickRandom() {
    draw(Math.random() < 0.5 ? 'truth' : 'dare');
  }

  function handlePickAgain() {
    if (currentType) {
      draw(currentType);
      return;
    }
    handlePickRandom();
  }

  return (
    <div className="game-panel rules-panel tod-panel">
      <div className="rules-panel-header">
        {game.image && (
          <img
            className="rules-panel-thumb"
            src={game.image}
            alt=""
            aria-hidden="true"
          />
        )}
        <div className="rules-panel-intro">
          <h2>{rules?.title ?? game.title}</h2>
          <p className="rules-panel-summary">{rules?.summary ?? game.shortIntro}</p>
          <span className="rules-panel-range">{rules?.players ?? game.playerRange}</span>
        </div>
      </div>

      {rules && (
        <div className="rules-panel-cards tod-rules-compact">
          <section className="rules-card">
            <h3>怎么玩</h3>
            <ul className="rules-card-list">
              {rules.flow.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          {rules.safetyNote && (
            <section className="rules-card rules-card--safety">
              <h3>安全提示</h3>
              <p className="rules-card-text">{rules.safetyNote}</p>
            </section>
          )}
        </div>
      )}

      <section className="tod-picker">
        <h3 className="tod-picker-title">抽题区</h3>

        {currentItem ? (
          <div className="tod-result">
            <span className="tod-type">
              当前类型：{TYPE_LABELS[currentType]}
            </span>
            <p className="tod-text">{currentItem.text}</p>
          </div>
        ) : (
          <p className="tod-empty">还没有抽题，先选择一种题目开始。</p>
        )}

        <div className="tod-actions">
          <button type="button" className="btn btn-primary tod-btn" onClick={handlePickTruth}>
            抽真心话
          </button>
          <button type="button" className="btn btn-day tod-btn" onClick={handlePickDare}>
            抽大冒险
          </button>
          <button type="button" className="btn btn-secondary tod-btn" onClick={handlePickRandom}>
            随机来一个
          </button>
          <button type="button" className="btn btn-ghost tod-btn" onClick={handlePickAgain}>
            再来一题
          </button>
        </div>

        <p className="tod-safety">任何题目都可以跳过，不需要解释。</p>
      </section>
    </div>
  );
}
