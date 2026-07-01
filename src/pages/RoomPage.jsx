import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNickname, getRoomRole, getCreatedRoomCode } from '../lib/storage';
import { ensureCurrentPlayerInRoom } from '../lib/roomPlayers';
import { getAllGames, getGameById } from '../lib/games';
import RoomHeader from '../components/room/RoomHeader';
import PlayerList from '../components/room/PlayerList';
import GameList from '../components/room/GameList';
import RulesSummary from '../components/room/RulesSummary';
import GamePanel from '../components/GamePanel';
import {
  WEREWOLF_INITIAL_SESSION,
  isWerewolfSessionStarted,
} from '../components/games/WerewolfPanel';
import '../styles/room.css';
import '../styles/game-panel.css';

const SWITCH_GAME_CONFIRM =
  '当前狼人杀本局已经开始，切换游戏会结束本局并清空身份，确定继续吗？';
const LEAVE_ROOM_CONFIRM =
  '当前游戏已经开始，退出房间会结束本局，确定退出吗？';

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
  const [werewolfSession, setWerewolfSession] = useState(WEREWOLF_INITIAL_SESSION);
  const [players, setPlayers] = useState([]);

  const selectedGameIdRef = useRef(selectedGameId);
  const werewolfSessionRef = useRef(werewolfSession);
  selectedGameIdRef.current = selectedGameId;
  werewolfSessionRef.current = werewolfSession;

  useEffect(() => {
    if (!code) {
      setPlayers([]);
      return;
    }
    setPlayers(ensureCurrentPlayerInRoom(code, nickname, isHost));
  }, [code, nickname, isHost]);

  const displayNickname = nickname.trim() || '临时玩家';

  function isCurrentGameStarted() {
    if (selectedGameIdRef.current === 'werewolf') {
      return isWerewolfSessionStarted(werewolfSessionRef.current);
    }
    return false;
  }

  function resetWerewolfSession() {
    setWerewolfSession(WEREWOLF_INITIAL_SESSION);
  }

  function handleSelectGame(gameId) {
    if (gameId === selectedGameIdRef.current) return;

    if (isCurrentGameStarted()) {
      if (!window.confirm(SWITCH_GAME_CONFIRM)) return;
      resetWerewolfSession();
    }

    setSelectedGameId(gameId);
  }

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

  function handleLeaveRoom() {
    if (isCurrentGameStarted()) {
      if (!window.confirm(LEAVE_ROOM_CONFIRM)) return;
    }
    navigate('/');
  }

  return (
    <div className="room-page">
      <div className="room-bg" aria-hidden="true">
        <div className="room-bg-glow room-bg-glow--purple" />
        <div className="room-bg-glow room-bg-glow--blue" />
        <div className="room-bg-stars" />
      </div>

      <RoomHeader
        code={code}
        nickname={displayNickname}
        isHost={isHost}
        onCopy={handleCopy}
        onInvite={handleInvite}
        onExit={handleLeaveRoom}
      />

      <div className="room-body">
        <aside className="room-sidebar room-sidebar-left">
          <PlayerList players={players} />
        </aside>

        <main className="room-main">
          <GamePanel
            game={selectedGame}
            werewolfSession={werewolfSession}
            onWerewolfSessionChange={setWerewolfSession}
          />
        </main>

        <aside className="room-sidebar room-sidebar-right">
          <GameList
            games={games}
            selectedId={selectedGameId}
            onSelectGame={handleSelectGame}
          />
          <RulesSummary game={selectedGame} />
        </aside>
      </div>
    </div>
  );
}
