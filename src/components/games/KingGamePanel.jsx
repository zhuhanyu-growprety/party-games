import { useRef, useState } from 'react';
import bank from '../../data/gameBanks/kingGameCommands.v1.json';
import { getGameRules } from '../../lib/gameRules';

const FOOTER = '国王只负责发布轻量指令：好笑可以，危险和冒犯不行。';
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

function getAvailableCommands(playerCount) {
  const nonKing = playerCount - 1;
  return bank.commands.filter((cmd) => cmd.playersNeeded <= nonKing);
}

function pickCommand(pool, lastId) {
  if (!pool.length) return null;
  if (pool.length === 1) return pool[0];
  let item = pool[Math.floor(Math.random() * pool.length)];
  if (item.id === lastId) {
    const alt = pool.filter((c) => c.id !== lastId);
    if (alt.length) item = alt[Math.floor(Math.random() * alt.length)];
  }
  return item;
}

function buildRound(playerCount, lastCommandId = null, fixedKing = null) {
  const available = getAvailableCommands(playerCount);
  if (!available.length) return null;

  const king = fixedKing ?? Math.floor(Math.random() * playerCount) + 1;
  const command = pickCommand(available, lastCommandId);
  if (!command) return null;
  const pool = Array.from({ length: playerCount }, (_, i) => i + 1).filter((n) => n !== king);
  const nums = shufflePick(pool, command.playersNeeded);
  const mapping = { A: nums[0], B: nums[1], C: nums[2] };

  let text = command.text;
  if (command.playersNeeded >= 1) text = text.replace(/A号/g, `${mapping.A}号`);
  if (command.playersNeeded >= 2) text = text.replace(/B号/g, `${mapping.B}号`);
  if (command.playersNeeded >= 3) text = text.replace(/C号/g, `${mapping.C}号`);

  return { king, text, commandId: command.id };
}

export default function KingGamePanel({ game }) {
  const rules = getGameRules('king');
  const lastCmdRef = useRef(null);
  const [playerCount, setPlayerCount] = useState(6);
  const [round, setRound] = useState(null);
  const [hint, setHint] = useState('');

  function clampCount(value) {
    return Math.min(MAX_PLAYERS, Math.max(MIN_PLAYERS, value));
  }

  function startRound(keepKing = false) {
    const count = clampCount(playerCount);
    setPlayerCount(count);
    const next = buildRound(
      count,
      keepKing ? lastCmdRef.current : null,
      keepKing && round ? round.king : null,
    );
    if (!next) {
      setHint('当前人数不足以执行可用指令，请增加人数。');
      return;
    }
    lastCmdRef.current = next.commandId;
    setRound(next);
    setHint('');
  }

  function swapCommand() {
    if (!round) {
      startRound(false);
      return;
    }
    startRound(true);
  }

  function resetAll() {
    setRound(null);
    setHint('');
    lastCmdRef.current = null;
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
        <h3 className="lite-tool-title">国王发令</h3>
        <div className="lite-tool-input-row">
          <label htmlFor="king-players">玩家人数</label>
          <input
            id="king-players"
            type="number"
            className="lite-tool-number"
            min={MIN_PLAYERS}
            max={MAX_PLAYERS}
            value={playerCount}
            onChange={(e) => setPlayerCount(clampCount(Number(e.target.value) || MIN_PLAYERS))}
          />
        </div>

        {!round ? (
          <p className="lite-tool-empty">设置人数后，开始一轮国王游戏。</p>
        ) : (
          <div className="lite-tool-card">
            <p className="lite-tool-king">国王：{round.king}号</p>
            <p className="lite-tool-command">{round.text}</p>
          </div>
        )}

        {hint && <p className="lite-tool-message">{hint}</p>}

        <div className="lite-tool-actions">
          <button type="button" className="btn btn-primary lite-tool-btn" onClick={() => startRound(false)}>
            开始一轮
          </button>
          <button type="button" className="btn btn-secondary lite-tool-btn" onClick={swapCommand} disabled={!round}>
            换一张指令
          </button>
          <button type="button" className="btn btn-ghost lite-tool-btn" onClick={resetAll}>
            重新开始
          </button>
        </div>

        <p className="lite-tool-footer">{FOOTER}</p>
      </section>
    </div>
  );
}
