import { useState } from 'react';
import { Info } from 'lucide-react';

const ROLES = ['狼人', '村民', '预言家', '女巫', '猎人'];

const PHASES = [
  { key: 'preparing', label: '准备中' },
  { key: 'night', label: '夜晚' },
  { key: 'day', label: '白天讨论' },
  { key: 'vote', label: '投票阶段' },
];

function pickRandomRole() {
  return ROLES[Math.floor(Math.random() * ROLES.length)];
}

export default function WerewolfPanel() {
  const [identity, setIdentity] = useState(null);
  const [phase, setPhase] = useState('preparing');

  function handleDeal() {
    setIdentity(pickRandomRole());
    setPhase('preparing');
  }

  return (
    <div className="game-panel werewolf-panel">
      <div className="game-panel-header werewolf-panel-header">
        <img
          className="werewolf-header-thumb"
          src="/illustrations/game-werewolf.png"
          alt=""
          aria-hidden="true"
        />
        <div>
          <h2>狼人杀开局助手</h2>
          <p>手机负责开局和流程，真正的博弈留在桌上</p>
        </div>
      </div>

      <div className="phase-stepper">
        {PHASES.map((item, index) => (
          <div
            key={item.key}
            className={`phase-step${phase === item.key ? ' active' : ''}${PHASES.findIndex((p) => p.key === phase) > index ? ' done' : ''}`}
          >
            <span className="phase-step-dot" />
            <span className="phase-step-label">{item.label}</span>
            {index < PHASES.length - 1 && <span className="phase-step-line" />}
          </div>
        ))}
      </div>

      <div className="werewolf-identity-card">
        <div className="werewolf-identity-overlay">
          {identity ? (
            <>
              <div className="werewolf-identity-label">你的身份</div>
              <div className="werewolf-identity-value">{identity}</div>
            </>
          ) : (
            <div className="werewolf-identity-value waiting">
              请等待房主开始本轮发牌
            </div>
          )}
        </div>
      </div>

      <div className="werewolf-actions">
        <button type="button" className="btn btn-primary werewolf-btn-deal" onClick={handleDeal}>
          开始发牌
        </button>
        <button type="button" className="btn btn-night" onClick={() => setPhase('night')}>
          进入夜晚
        </button>
        <button type="button" className="btn btn-day" onClick={() => setPhase('day')}>
          进入白天
        </button>
        <button type="button" className="btn btn-vote" onClick={() => setPhase('vote')}>
          进入投票
        </button>
      </div>

      <div className="werewolf-rules">
        <h4>本局说明</h4>
        <ul>
          <li>网站负责分配身份和切换阶段</li>
          <li>讨论、发言和投票都在线下完成</li>
          <li>第一版不处理线上技能和自动胜负</li>
        </ul>
      </div>

      <p className="werewolf-footer-tip">
        <Info size={14} strokeWidth={1.75} aria-hidden="true" />
        本站只辅助开局与流程，博弈与淘汰请在现场完成
      </p>
    </div>
  );
}
