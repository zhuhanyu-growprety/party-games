import { useRef, useState } from 'react';
import bank from '../../data/gameBanks/undercoverWords.v1.json';
import { getGameRules } from '../../lib/gameRules';

const FOOTER = '手机只负责发词，描述、讨论和投票都在线下完成。';
const MIN_PLAYERS = 3;
const MAX_PLAYERS = 12;

function shufflePick(pool, count) {
  const copy = [...pool];
  const picked = [];
  for (let i = 0; i < count; i += 1) {
    const idx = Math.floor(Math.random() * copy.length);
    picked.push(copy.splice(idx, 1)[0]);
  }
  return picked;
}

function pickPair(pool, lastId) {
  if (!pool.length) return null;
  if (pool.length === 1) return pool[0];
  let item = pool[Math.floor(Math.random() * pool.length)];
  if (item.id === lastId) {
    const alt = pool.filter((p) => p.id !== lastId);
    if (alt.length) item = alt[Math.floor(Math.random() * alt.length)];
  }
  return item;
}

function maxUndercover(playerCount) {
  return playerCount < 5 ? 1 : 2;
}

function buildDeal(playerCount, undercoverCount) {
  const pair = pickPair(bank.wordPairs, null);
  if (!pair) return null;

  const undercoverNums = shufflePick(
    Array.from({ length: playerCount }, (_, i) => i + 1),
    undercoverCount,
  );
  const undercoverSet = new Set(undercoverNums);

  const assignments = Array.from({ length: playerCount }, (_, i) => {
    const num = i + 1;
    return {
      player: num,
      word: undercoverSet.has(num) ? pair.undercoverWord : pair.civilianWord,
      isUndercover: undercoverSet.has(num),
    };
  });

  return {
    pair,
    undercoverNums,
    assignments,
    currentIndex: 0,
    revealed: false,
    done: false,
  };
}

export default function UndercoverPanel({ game }) {
  const rules = getGameRules('undercover');
  const [playerCount, setPlayerCount] = useState(6);
  const [undercoverCount, setUndercoverCount] = useState(1);
  const [deal, setDeal] = useState(null);
  const [hostOpen, setHostOpen] = useState(false);

  function clampPlayers(value) {
    return Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, value));
  }

  function clampUndercover(players, value) {
    const max = maxUndercover(players);
    return Math.min(max, Math.max(1, Math.min(value, players - 1)));
  }

  function handlePlayersChange(value) {
    const players = clampPlayers(value);
    setPlayerCount(players);
    setUndercoverCount((prev) => clampUndercover(players, prev));
  }

  function startDeal() {
    const players = clampPlayers(playerCount);
    const spies = clampUndercover(players, undercoverCount);
    setPlayerCount(players);
    setUndercoverCount(spies);
    const next = buildDeal(players, spies);
    if (!next) return;
    setDeal(next);
    setHostOpen(false);
  }

  function resetDeal() {
    setDeal(null);
    setHostOpen(false);
  }

  function revealWord() {
    if (!deal || deal.done) return;
    setDeal((prev) => ({ ...prev, revealed: true }));
  }

  function hideAndNext() {
    if (!deal || deal.done) return;
    const nextIndex = deal.currentIndex + 1;
    if (nextIndex >= deal.assignments.length) {
      setDeal((prev) => ({ ...prev, revealed: false, done: true }));
      return;
    }
    setDeal((prev) => ({
      ...prev,
      currentIndex: nextIndex,
      revealed: false,
    }));
  }

  const current = deal && !deal.done ? deal.assignments[deal.currentIndex] : null;

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
        <h3 className="lite-tool-title">发词区</h3>

        {!deal && (
          <>
            <div className="lite-tool-input-row">
              <label htmlFor="uc-players">玩家人数</label>
              <input
                id="uc-players"
                type="number"
                className="lite-tool-number"
                min={MIN_PLAYERS}
                max={MAX_PLAYERS}
                value={playerCount}
                onChange={(e) => handlePlayersChange(Number(e.target.value) || MIN_PLAYERS)}
              />
            </div>
            <div className="lite-tool-input-row">
              <label htmlFor="uc-spies">卧底人数</label>
              <input
                id="uc-spies"
                type="number"
                className="lite-tool-number"
                min={1}
                max={maxUndercover(playerCount)}
                value={undercoverCount}
                onChange={(e) => setUndercoverCount(clampUndercover(playerCount, Number(e.target.value) || 1))}
              />
            </div>
            <p className="lite-tool-empty">设置人数后开始发词，传手机逐个查看。</p>
          </>
        )}

        {deal && !deal.done && current && (
          <div className="lite-tool-card">
            <p className="lite-tool-player">当前：{current.player}号玩家</p>
            {!deal.revealed ? (
              <button type="button" className="btn btn-primary lite-tool-btn" onClick={revealWord}>
                点击查看你的词
              </button>
            ) : (
              <>
                <p className="lite-tool-word">{current.word}</p>
                <button type="button" className="btn btn-secondary lite-tool-btn" onClick={hideAndNext}>
                  隐藏并交给下一位
                </button>
              </>
            )}
          </div>
        )}

        {deal?.done && (
          <p className="lite-tool-done">发词完成，开始线下发言。</p>
        )}

        <div className="lite-tool-actions">
          <button type="button" className="btn btn-primary lite-tool-btn" onClick={startDeal}>
            开始发词
          </button>
          <button type="button" className="btn btn-ghost lite-tool-btn" onClick={resetDeal} disabled={!deal}>
            重新开局
          </button>
        </div>

        {deal && (
          <div className="lite-tool-host">
            <button
              type="button"
              className="btn btn-ghost lite-tool-btn"
              onClick={() => setHostOpen((v) => !v)}
            >
              {hostOpen ? '收起主持人词底' : '主持人查看词底'}
            </button>
            {hostOpen && (
              <div className="lite-tool-host-body">
                <p>平民词：{deal.pair.civilianWord}</p>
                <p>卧底词：{deal.pair.undercoverWord}</p>
                <p>卧底编号：{deal.undercoverNums.join('、')}号</p>
              </div>
            )}
          </div>
        )}

        <p className="lite-tool-footer">{FOOTER}</p>
      </section>
    </div>
  );
}
