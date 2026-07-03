import {
  getTabPlayerId,
  getTabPlayerName,
  setTabPlayerName,
  getTabPlayerAvatarSlot,
  setTabPlayerAvatarSlot,
} from './tabPlayer';

const MAX_PLAYERS = 12;
const STALE_MS = 60_000;
const FALLBACK_NICKNAME = '临时玩家';

export function roomPlayersStorageKey(code) {
  return `party-games:room:${code}:players`;
}

export function getRoomPlayers(code) {
  if (!code) return [];
  try {
    const raw = localStorage.getItem(roomPlayersStorageKey(code));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setRoomPlayers(code, players) {
  if (!code) return;
  localStorage.setItem(roomPlayersStorageKey(code), JSON.stringify(players));
}

function pruneStalePlayers(players) {
  const now = Date.now();
  return players.filter((player) => now - player.lastSeen < STALE_MS);
}

function normalizePlayer(player, index) {
  return {
    ...player,
    id: player.id || player.playerId,
    playerId: player.id || player.playerId,
    slot: index + 1,
  };
}

function pickAvatarSlot(existingPlayers) {
  const used = new Set(existingPlayers.map((p) => p.avatarSlot).filter(Boolean));
  for (let i = 1; i <= 12; i += 1) {
    if (!used.has(i)) return i;
  }
  return (existingPlayers.length % 12) + 1;
}

export function getDisplayPlayers(code) {
  return pruneStalePlayers(getRoomPlayers(code)).map(normalizePlayer);
}

export function ensureTabPlayerInRoom(code, nickname) {
  if (!code) return [];

  const playerId = getTabPlayerId();
  const name = nickname.trim() || getTabPlayerName() || FALLBACK_NICKNAME;
  setTabPlayerName(name);

  let players = pruneStalePlayers(getRoomPlayers(code));
  const existingIndex = players.findIndex((p) => p.id === playerId);

  if (existingIndex >= 0) {
    const existing = players[existingIndex];
    players[existingIndex] = {
      ...existing,
      name,
      lastSeen: Date.now(),
    };
    const normalized = players.map(normalizePlayer);
    setRoomPlayers(code, normalized);
    return normalized;
  }

  if (players.length >= MAX_PLAYERS) {
    return players.map(normalizePlayer);
  }

  const avatarSlot = getTabPlayerAvatarSlot() ?? pickAvatarSlot(players);
  setTabPlayerAvatarSlot(avatarSlot);

  const now = Date.now();
  const updated = [
    ...players,
    {
      id: playerId,
      playerId,
      name,
      avatarSlot,
      isHost: players.length === 0,
      joinedAt: now,
      lastSeen: now,
    },
  ].map(normalizePlayer);

  setRoomPlayers(code, updated);
  return updated;
}

export function touchTabPlayerHeartbeat(code, nickname) {
  if (!code) return [];

  const playerId = getTabPlayerId();
  const name = nickname.trim() || getTabPlayerName() || FALLBACK_NICKNAME;
  let players = pruneStalePlayers(getRoomPlayers(code));
  const index = players.findIndex((p) => p.id === playerId);

  if (index >= 0) {
    players[index] = {
      ...players[index],
      name,
      lastSeen: Date.now(),
    };
    const normalized = players.map(normalizePlayer);
    setRoomPlayers(code, normalized);
    return normalized;
  }

  return ensureTabPlayerInRoom(code, nickname);
}

export function removeTabPlayerFromRoom(code) {
  if (!code) return;

  const playerId = getTabPlayerId();
  const players = getRoomPlayers(code)
    .filter((p) => p.id !== playerId)
    .map(normalizePlayer);
  setRoomPlayers(code, players);
}

export function isTabPlayerHost(players, tabPlayerId) {
  return players.some((player) => player.id === tabPlayerId && player.isHost);
}
