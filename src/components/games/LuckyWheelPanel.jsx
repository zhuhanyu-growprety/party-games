import { useRef, useState } from 'react';
import { getGameRules } from '../../lib/gameRules';

const FOOTER = '转盘结果适合做轻量决定，具体玩法由现场自由约定。';

const DEFAULT_OPTIONS = [
  '真心话',
  '大冒险',
  '免罚一次',
  '夸一位朋友',
  '模仿一个表情',
  '讲一个冷笑话',
  '指定下一位',
  '再转一次',
];

function pickOption(options, lastValue) {
  if (!options.length) return null;
  if (options.length === 1) return options[0];
  let item = options[Math.floor(Math.random() * options.length)];
  if (item === lastValue) {
    const alt = options.filter((o) => o !== lastValue);
    if (alt.length) item = alt[Math.floor(Math.random() * alt.length)];
  }
  return item;
}

export default function LuckyWheelPanel({ game }) {
  const rules = getGameRules('wheel');
  const lastResultRef = useRef(null);
  const [optionsText, setOptionsText] = useState(DEFAULT_OPTIONS.join('\n'));
  const [savedOptions, setSavedOptions] = useState(DEFAULT_OPTIONS);
  const [result, setResult] = useState(null);
  const [hint, setHint] = useState('');

  function handleSave() {
    const opts = optionsText.split('\n').map((s) => s.trim()).filter(Boolean);
    setSavedOptions(opts);
    setHint('');
  }

  function handleReset() {
    setOptionsText(DEFAULT_OPTIONS.join('\n'));
    setSavedOptions(DEFAULT_OPTIONS);
    setResult(null);
    setHint('');
    lastResultRef.current = null;
  }

  function handlePick() {
    if (savedOptions.length < 2) {
      setHint('至少保留 2 个选项再开始。');
      setResult(null);
      return;
    }
    const item = pickOption(savedOptions, lastResultRef.current);
    lastResultRef.current = item;
    setResult(item);
    setHint('');
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
        <h3 className="lite-tool-title">转盘区</h3>
        <label className="lite-tool-label" htmlFor="wheel-options">编辑选项（一行一个）</label>
        <textarea
          id="wheel-options"
          className="lite-tool-textarea"
          value={optionsText}
          onChange={(e) => setOptionsText(e.target.value)}
          rows={6}
        />
        <div className="lite-tool-actions">
          <button type="button" className="btn btn-secondary lite-tool-btn" onClick={handleSave}>
            保存选项
          </button>
          <button type="button" className="btn btn-primary lite-tool-btn" onClick={handlePick}>
            随机抽选
          </button>
          <button type="button" className="btn btn-ghost lite-tool-btn" onClick={handleReset}>
            重置默认
          </button>
        </div>
        {hint && <p className="lite-tool-message">{hint}</p>}
        {result && (
          <div className="lite-tool-card lite-tool-result">
            本次结果：{result}
          </div>
        )}
        <p className="lite-tool-footer">{FOOTER}</p>
      </section>
    </div>
  );
}
