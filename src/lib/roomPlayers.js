import {
  getPlayerId,
  getRoomPlayers,
  setRoomPlayers,
} from './storage';

const MAX_PLAYERS = 12;
const FALLBACK_NICKNAME = '临时玩家';

export function ensureCurrentPlayerInRoom(code, nickname, isHost) {
  if (!code) return [];

  const playerId = getPlayerId();
  const name = nickname.trim() || FALLBACK_NICKNAME;
  const players = getRoomPlayers(code);
  const existingIndex = players.findIndex((p) => p.playerId === playerId);

  if (existingIndex >= 0) {
    const updated = [...players];
    updated[existingIndex] = {
      ...updated[existingIndex],
      name,
      isHost: isHost || updated[existingIndex].isHost,
    };
    setRoomPlayers(code, updated);
    return updated;
  }

  if (players.length >= MAX_PLAYERS) {
    return players;
  }

  const updated = [
    ...players,
    {
      playerId,
      name,
      isHost,
      slot: players.length + 1,
    },
  ];
  setRoomPlayers(code, updated);
  return updated;
}
