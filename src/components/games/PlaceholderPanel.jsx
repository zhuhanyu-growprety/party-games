import { getGameRules } from '../../lib/gameRules';

function RulesList({ items }) {
  return (
    <ul className="rules-card-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function PlaceholderPanel({ game }) {
  const rules = getGameRules(game.id);

  if (!rules) {
    return (
      <div className="game-panel placeholder-panel">
        <div className="game-panel-header">
          <h2>{game.title}</h2>
          <p>{game.shortIntro}</p>
        </div>
        <div className="game-panel-placeholder card">
          <p className="placeholder-status">暂无规则说明</p>
        </div>
      </div>
    );
  }

  return (
    <div className="game-panel rules-panel">
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
          <h2>{rules.title}</h2>
          <p className="rules-panel-summary">{rules.summary}</p>
          <span className="rules-panel-range">{rules.players}</span>
        </div>
      </div>

      <div className="rules-panel-cards">
        <section className="rules-card">
          <h3>开局准备</h3>
          <RulesList items={rules.setup} />
        </section>

        <section className="rules-card">
          <h3>怎么玩</h3>
          <RulesList items={rules.flow} />
        </section>

        <section className="rules-card rules-card--phone">
          <h3>手机负责什么</h3>
          <p className="rules-card-text">{rules.phoneRole}</p>
        </section>

        <section className="rules-card">
          <h3>现场怎么进行</h3>
          <RulesList items={rules.livePlay} />
        </section>

        {rules.safetyNote && (
          <section className="rules-card rules-card--safety">
            <h3>安全提示</h3>
            <p className="rules-card-text">{rules.safetyNote}</p>
          </section>
        )}
      </div>

      <div className="rules-panel-footer">
        <p className="rules-panel-status">{rules.currentStatus}</p>
        <p className="rules-panel-next">
          后续补齐：{rules.nextFeatures.join('、')}
        </p>
        <button
          type="button"
          className="btn btn-secondary rules-panel-cta"
          disabled
        >
          功能建设中 · 先按规则线下开玩
        </button>
      </div>
    </div>
  );
}
