import { useState } from 'react';
import { getGameRules } from '../../lib/gameRules';

const RANGE_MIN = 1;
const RANGE_MAX = 100;
const MAX_GUESS_HISTORY = 8;

const BOMB_PLAY_RULES = [
  '手机在 1–100 之间随机生成隐藏炸弹数字，答案不会提前显示。',
  '玩家轮流输入猜测，手机提示比隐藏数字大、小，或是否踩中。',
  '每次猜测后安全范围不断缩小，直到有人猜中隐藏数字。',
  '猜中隐藏数字的人踩中炸弹，本轮结束，可重新开始。',
];

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
        message: `${guess} 正好是隐藏炸弹数字，炸弹引爆，本轮结束。`,
      }));
      setInput('');
      return;
    }

    if (guess < round.bomb) {
      setRound((prev) => ({
        ...prev,
        min: guess + 1,
        guesses: [guess, ...prev.guesses].slice(0, MAX_GUESS_HISTORY),
        message: `${guess} 比隐藏数字小，新范围：${guess + 1} – ${prev.max}`,
      }));
    } else {
      setRound((prev) => ({
        ...prev,
        max: guess - 1,
        guesses: [guess, ...prev.guesses].slice(0, MAX_GUESS_HISTORY),
        message: `${guess} 比隐藏数字大，新范围：${prev.min} – ${guess - 1}`,
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
              {BOMB_PLAY_RULES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
      )}

      <section className="bomb-play">
        <h3 className="bomb-play-title">游戏区</h3>

        <p className="bomb-notice">
          本轮已在 1–100 之间生成隐藏炸弹数字。答案不会显示，手机只负责判断大了、小了，或是否踩中炸弹。
        </p>

        <div className={`bomb-range-card${round.gameOver ? ' bomb-range-card--over' : ''}`}>
          <span className="bomb-range-label">安全猜测范围</span>
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
              placeholder={`输入 ${round.min}–${round.max} 之间的数字`}
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
