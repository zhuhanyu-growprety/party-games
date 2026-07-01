export default function PlayerList({ players, maxPlayers = 12 }) {
  return (
    <div className="player-list-wrap">
      <div className="player-list-header">
        <h3>玩家列表</h3>
        <span className="player-count">{players.length}/{maxPlayers}</span>
      </div>
      <ul className="player-list">
        {players.map((player) => (
          <li key={player.id} className="player-item">
            <span className="player-avatar" aria-hidden="true">
              {player.name.charAt(0)}
            </span>
            <div className="player-info">
              <span className="player-name">
                {player.name}
                {player.isHost && <span className="player-host-tag">房主</span>}
              </span>
              <span className="player-status">
                <span className="player-status-dot" />
                在线
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div className="player-list-deco" aria-hidden="true">
        <span>🧑‍🤝‍🧑</span>
        <span>🎊</span>
        <span>🍻</span>
      </div>
    </div>
  );
}
