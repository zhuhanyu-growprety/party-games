import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNickname, getRoomRole, getCreatedRoomCode } from '../lib/storage';
import { getAllGames, getGameById } from '../lib/games';
import RoomHeader from '../components/room/RoomHeader';
import PlayerList from '../components/room/PlayerList';
import GameList from '../components/room/GameList';
import RulesSummary from '../components/room/RulesSummary';
import GamePanel from '../components/GamePanel';
import '../styles/room.css';
import '../styles/game-panel.css';

const MOCK_PLAYERS = [
  { id: 1, name: '成员1', isHost: true },
  { id: 2, name: '成员2', isHost: false },
  { id: 3, name: '成员3', isHost: false },
  { id: 4, name: '成员4', isHost: false },
];

export default function RoomPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const nickname = getNickname();
  const role = getRoomRole();
  const createdCode = getCreatedRoomCode();
  const isHost = role === 'host' && createdCode === code;

  const games = getAllGames();
  const [selectedGameId, setSelectedGameId] = useState('werewolf');
  const selectedGame = getGameById(selectedGameId);

  const players = MOCK_PLAYERS.map((p) =>
    p.id === 1 && nickname ? { ...p, name: nickname } : p,
  );

  function handleCopy() {
    navigator.clipboard?.writeText(code).catch(() => {});
  }

  function handleInvite() {
    if (navigator.share) {
      navigator.share({
        title: '聚会游戏合集',
        text: `来一起玩！房间码：${code}`,
      }).catch(() => {});
    } else {
      handleCopy();
      alert('房间码已复制，发给朋友即可加入');
    }
  }

  function handleExit() {
    navigate('/');
  }

  return (
    <div className="room-page">
      <RoomHeader
        code={code}
        nickname={nickname}
        isHost={isHost}
        onCopy={handleCopy}
        onInvite={handleInvite}
        onExit={handleExit}
      />

      <div className="room-body">
        <aside className="room-sidebar room-sidebar-left">
          <PlayerList players={players} />
        </aside>

        <main className="room-main">
          <GamePanel game={selectedGame} />
        </main>

        <aside className="room-sidebar room-sidebar-right">
          <GameList
            games={games}
            selectedId={selectedGameId}
            onSelect={setSelectedGameId}
          />
          <RulesSummary game={selectedGame} />
        </aside>
      </div>
    </div>
  );
}
