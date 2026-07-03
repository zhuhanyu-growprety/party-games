import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { getNickname } from '../lib/storage';
import {
  ensureTabPlayerInRoom,
  touchTabPlayerHeartbeat,
  removeTabPlayerFromRoom,
  getDisplayPlayers,
  isTabPlayerHost,
  roomPlayersStorageKey,
} from '../lib/roomPlayers';
import { getTabPlayerId } from '../lib/tabPlayer';
import { getAllGames, getGameById } from '../lib/games';
import RoomHeader from '../components/room/RoomHeader';
import PlayerList from '../components/room/PlayerList';
import GameList from '../components/room/GameList';
import RulesSummary from '../components/room/RulesSummary';
import GamePanel from '../components/GamePanel';
import { WEREWOLF_INITIAL_SESSION } from '../components/games/WerewolfPanel';
import '../styles/room.css';
import '../styles/game-panel.css';

const SWITCH_GAME_CONFIRM =
  '当前狼人杀本局已经开始，切换游戏会结束本局并清空身份，确定继续吗？';
const LEAVE_ROOM_CONFIRM =
  '当前游戏已经开始，退出房间会结束本局，确定退出吗？';
const HEARTBEAT_MS = 12_000;

function resolveInitialGameId(searchParams) {
  const gameId = searchParams.get('game');
  if (gameId && getGameById(gameId)) return gameId;
  return 'werewolf';
}

export default function RoomPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const nickname = getNickname();
  const tabPlayerId = getTabPlayerId();

  const games = getAllGames();
  const [selectedGameId, setSelectedGameId] = useState(() => resolveInitialGameId(searchParams));
  const selectedGame = getGameById(selectedGameId);
  const [werewolfSession, setWerewolfSession] = useState(WEREWOLF_INITIAL_SESSION);
  const [startedGameId, setStartedGameId] = useState(null);
  const [players, setPlayers] = useState([]);

  const selectedGameIdRef = useRef(selectedGameId);
  const startedGameIdRef = useRef(startedGameId);
  selectedGameIdRef.current = selectedGameId;
  startedGameIdRef.current = startedGameId;

  const isHost = isTabPlayerHost(players, tabPlayerId);
  const displayNickname = nickname.trim() || '临时玩家';

  useEffect(() => {
    if (!code) {
      setPlayers([]);
      return undefined;
    }

    function syncPlayers() {
      const next = getDisplayPlayers(code);
      setPlayers(next);
      return next;
    }

    ensureTabPlayerInRoom(code, nickname);
    syncPlayers();

    const heartbeat = setInterval(() => {
      touchTabPlayerHeartbeat(code, nickname);
      syncPlayers();
    }, HEARTBEAT_MS);

    function handleStorage(event) {
      if (event.key === roomPlayersStorageKey(code)) {
        syncPlayers();
      }
    }

    function handleUnload() {
      removeTabPlayerFromRoom(code);
    }

    window.addEventListener('storage', handleStorage);
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearInterval(heartbeat);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [code, nickname]);

  function handleWerewolfSessionChange(session) {
    setWerewolfSession(session);
    if (session.started) {
      setStartedGameId('werewolf');
    }
  }

  function resetWerewolfSession() {
    setWerewolfSession(WEREWOLF_INITIAL_SESSION);
    setStartedGameId(null);
  }

  function handleSelectGame(gameId) {
    if (gameId === selectedGameIdRef.current) return;

    const currentStartedGameId = startedGameIdRef.current || startedGameId;

    if (!currentStartedGameId) {
      setSelectedGameId(gameId);
      return;
    }

    if (!window.confirm(SWITCH_GAME_CONFIRM)) return;

    resetWerewolfSession();
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
    const currentStartedGameId = startedGameIdRef.current || startedGameId;
    if (currentStartedGameId) {
      if (!window.confirm(LEAVE_ROOM_CONFIRM)) return;
    }
    removeTabPlayerFromRoom(code);
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

      <p className="room-demo-note">当前版本为本地房间工具，适合线下传手机使用。</p>

      <div className="room-body">
        <aside className="room-sidebar room-sidebar-left">
          <PlayerList players={players} />
        </aside>

        <main className="room-main">
          <GamePanel
            game={selectedGame}
            werewolfSession={werewolfSession}
            onWerewolfSessionChange={handleWerewolfSessionChange}
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
