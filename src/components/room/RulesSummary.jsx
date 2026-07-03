import { Link } from 'react-router-dom';
import { getGameRules } from '../../lib/gameRules';

const WEREWOLF_RULES = [
  '房主点击发牌，每人手机显示自己的身份',
  '夜晚、白天、投票的发言在线下完成',
  '第一版不做线上技能与自动胜负判断',
];

const DEFAULT_RULES = [
  '当前版本提供玩法说明',
  '完整互动功能后续补齐',
  '可先按规则线下开玩',
];

export default function RulesSummary({ game }) {
  let rules = DEFAULT_RULES;

  if (game?.id === 'werewolf') {
    rules = WEREWOLF_RULES;
  } else {
    const sidebar = getGameRules(game?.id)?.sidebarSummary;
    if (sidebar) rules = sidebar;
  }

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
