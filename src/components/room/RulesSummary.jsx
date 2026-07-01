import { Link } from 'react-router-dom';

const WEREWOLF_RULES = [
  '房主点击发牌，每人手机显示自己的身份',
  '夜晚、白天、投票的发言在线下完成',
  '第一版不做线上技能与自动胜负判断',
];

const DEFAULT_RULES = [
  '该游戏面板尚在开发中',
  '当前仅展示占位界面',
  '完整规则将在后续版本补充',
];

export default function RulesSummary({ game }) {
  const rules = game?.id === 'werewolf' ? WEREWOLF_RULES : DEFAULT_RULES;
  const title = game ? `${game.title}规则简述` : '规则简述';

  return (
    <div className="rules-summary card">
      <h3>{title}</h3>
      <ul>
        {rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
      <Link to={`/games/${game?.id ?? ''}`} className="rules-link">
        查看完整规则 ›
      </Link>
    </div>
  );
}
