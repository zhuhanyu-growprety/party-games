import { useState } from 'react';
import { getGameRules } from '../../lib/gameRules';

const RANGE_MIN = 1;
const RANGE_MAX = 100;
const MAX_GUESS_HISTORY = 8;

const BOMB_PLAY_RULES = [
  '手机随机藏好一个 1–100 之间的炸弹数字，开局不告诉你。',
  '玩家轮流输入猜测，手机只会提示偏大还是偏小。',
  '每次猜测后炸弹所在区间不断缩小。',
  '谁猜中那个隐藏数字，谁就踩中炸弹。',
];

const BOMB_SAFETY_NOTE =
  '踩中炸弹后完成一个提前约定的轻量挑战：好笑可以，危险和冒犯不行。';

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

function formatRange(min, max) {
  if (min === max) return `只剩最后一个数字：${min}`;
  return `${min} – ${max}`;
}

function formatPlaceholder(min, max) {
  if (min === max) return `输入最后的数字 ${min}`;
  return `输入 ${min}–${max} 之间的数字`;
}

function buildTooSmallMessage(guess, newMin, max) {
  if (newMin === max) {
    return `${guess} 偏小，只剩 ${newMin} 了。下一位要小心。`;
  }
  return `${guess} 偏小，炸弹在 ${newMin}–${max} 之间。`;
}

function buildTooLargeMessage(guess, min, newMax) {
  if (min === newMax) {
    return `${guess} 偏大，只剩 ${newMax} 了。下一位要小心。`;
  }
  return `${guess} 偏大，炸弹在 ${min}–${newMax} 之间。`;
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
        message: `请输入炸弹所在区间内的数字（${formatRange(prev.min, prev.max)}）。`,
      }));
      return;
    }

    if (guess === round.bomb) {
      setRound((prev) => ({
        ...prev,
        guesses: [guess, ...prev.guesses].slice(0, MAX_GUESS_HISTORY),
        gameOver: true,
        message: `${guess} 踩中炸弹，本轮结束！`,
      }));
      setInput('');
      return;
    }

    if (guess < round.bomb) {
      const newMin = guess + 1;
      setRound((prev) => ({
        ...prev,
        min: newMin,
        guesses: [guess, ...prev.guesses].slice(0, MAX_GUESS_HISTORY),
        message: buildTooSmallMessage(guess, newMin, prev.max),
      }));
    } else {
      const newMax = guess - 1;
      setRound((prev) => ({
        ...prev,
        max: newMax,
        guesses: [guess, ...prev.guesses].slice(0, MAX_GUESS_HISTORY),
        message: buildTooLargeMessage(guess, prev.min, newMax),
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

      <section className="bomb-play">
        <h3 className="bomb-play-title">游戏区</h3>

        <p className="bomb-notice">
          手机已经藏好一个 1–100 之间的炸弹数字。
          <br />
          每次输入一个数字，手机只会提示偏大、偏小，猜中就引爆。
        </p>

        <div className={`bomb-range-card${round.gameOver ? ' bomb-range-card--over' : ''}`}>
          <span className="bomb-range-label">炸弹所在区间</span>
          <span className="bomb-range-value">
            {formatRange(round.min, round.max)}
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
              placeholder={formatPlaceholder(round.min, round.max)}
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

        <p className="bomb-safety">{BOMB_SAFETY_NOTE}</p>
      </section>
    </div>
  );
}
