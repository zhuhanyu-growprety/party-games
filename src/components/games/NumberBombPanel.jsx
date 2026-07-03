import { useState } from 'react';
import { getGameRules } from '../../lib/gameRules';

const RANGE_MIN = 1;
const RANGE_MAX = 100;
const MAX_GUESS_HISTORY = 8;

function randomBomb() {
  return Math.floor(Math.random() * (RANGE_MAX - RANGE_MIN + 1)) + RANGE_MIN;
}

function createRound() {
  return {
    bomb: randomBomb(),
    min: RANGE_MIN,
    max: RANGE_MAX,
    guesses: [],
    gameOver: false,
    message: '',
  };
}

export default function NumberBombPanel({ game }) {
  const rules = getGameRules('bomb');
  const [round, setRound] = useState(createRound);
  const [input, setInput] = useState('');

  function resetRound() {
    setRound(createRound());
    setInput('');
  }

  function handleSubmit() {
    if (round.gameOver) return;

    const trimmed = input.trim();
    if (!trimmed) {
      setRound((prev) => ({ ...prev, message: '请输入一个数字。' }));
      return;
    }

    const guess = Number(trimmed);
    if (!Number.isInteger(guess)) {
      setRound((prev) => ({ ...prev, message: '请输入有效整数。' }));
      return;
    }

    if (guess < round.min || guess > round.max) {
      setRound((prev) => ({
        ...prev,
        message: `请输入当前范围内的数字（${prev.min} - ${prev.max}）。`,
      }));
      return;
    }

    if (guess === round.bomb) {
      setRound((prev) => ({
        ...prev,
        guesses: [guess, ...prev.guesses].slice(0, MAX_GUESS_HISTORY),
        gameOver: true,
        message: '炸弹引爆，本轮结束',
      }));
      setInput('');
      return;
    }

    if (guess < round.bomb) {
      setRound((prev) => ({
        ...prev,
        min: guess + 1,
        guesses: [guess, ...prev.guesses].slice(0, MAX_GUESS_HISTORY),
        message: `猜小了，新范围：${guess + 1} - ${prev.max}`,
      }));
    } else {
      setRound((prev) => ({
        ...prev,
        max: guess - 1,
        guesses: [guess, ...prev.guesses].slice(0, MAX_GUESS_HISTORY),
        message: `猜大了，新范围：${prev.min} - ${guess - 1}`,
      }));
    }
    setInput('');
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }

  return (
    <div className="game-panel rules-panel bomb-panel">
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
          <p className="rules-panel-summary">
            轮流报数，谁猜中隐藏数字谁就踩中炸弹。
          </p>
          <span className="rules-panel-range">{rules?.players ?? game.playerRange}</span>
        </div>
      </div>

      {rules && (
        <div className="rules-panel-cards bomb-rules-compact">
          <section className="rules-card">
            <h3>怎么玩</h3>
            <ul className="rules-card-list">
              {rules.flow.slice(0, 3).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <section className="bomb-play">
        <h3 className="bomb-play-title">游戏区</h3>

        <div className={`bomb-range-card${round.gameOver ? ' bomb-range-card--over' : ''}`}>
          <span className="bomb-range-label">当前范围</span>
          <span className="bomb-range-value">
            {round.min} - {round.max}
          </span>
        </div>

        {!round.gameOver && (
          <div className="bomb-input-row">
            <input
              type="number"
              className="bomb-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`输入 ${round.min} - ${round.max} 之间的数字`}
              min={round.min}
              max={round.max}
              inputMode="numeric"
            />
            <button type="button" className="btn btn-primary bomb-submit" onClick={handleSubmit}>
              提交数字
            </button>
          </div>
        )}

        {round.message && (
          <p className={`bomb-message${round.gameOver ? ' bomb-message--over' : ''}`}>
            {round.message}
          </p>
        )}

        {round.guesses.length > 0 && (
          <div className="bomb-history">
            <span className="bomb-history-label">最近猜测</span>
            <div className="bomb-history-tags">
              {round.guesses.map((n, index) => (
                <span key={`${n}-${index}`} className="bomb-history-tag">
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="bomb-actions">
          {round.gameOver && (
            <button type="button" className="btn btn-primary bomb-btn" onClick={resetRound}>
              重新开始
            </button>
          )}
          <button type="button" className="btn btn-secondary bomb-btn" onClick={resetRound}>
            重置本轮
          </button>
        </div>

        {rules?.safetyNote && (
          <p className="bomb-safety">{rules.safetyNote}</p>
        )}
      </section>
    </div>
  );
}
