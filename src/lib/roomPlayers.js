import {
  resolveTabPlayerIdForRoom,
  getTabPlayerId,
  getTabPlayerName,
  setTabPlayerName,
  getTabPlayerAvatarSlot,
  setTabPlayerAvatarSlot,
  clearTabRoomBinding,
} from './tabPlayer';

const MAX_PLAYERS = 12;
const STALE_MS = 60_000;
const HEARTBEAT_MS = 12_000;
const FALLBACK_NICKNAME = '临时玩家';

export { HEARTBEAT_MS };

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
  return players.filter((player) => now - (player.lastSeen ?? 0) < STALE_MS);
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

function ensureHost(players) {
  const active = players.filter(Boolean);
  if (!active.length) return active;

  const hasHost = active.some((player) => player.isHost);
  if (hasHost) return active;

  const earliest = [...active].sort((a, b) => (a.joinedAt ?? 0) - (b.joinedAt ?? 0))[0];
  return active.map((player) => ({
    ...player,
    isHost: player.id === earliest.id,
  }));
}

function commitPlayers(code, incomingPlayers) {
  const stored = pruneStalePlayers(getRoomPlayers(code));
  const merged = new Map(stored.map((player) => [player.id, player]));

  for (const player of incomingPlayers) {
    const existing = merged.get(player.id);
    if (!existing) {
      merged.set(player.id, player);
      continue;
    }

    merged.set(player.id, {
      ...existing,
      ...player,
      joinedAt: existing.joinedAt ?? player.joinedAt,
      isHost: existing.isHost || player.isHost,
      lastSeen: Math.max(existing.lastSeen ?? 0, player.lastSeen ?? 0),
    });
  }

  const withHost = ensureHost(Array.from(merged.values()));
  const normalized = withHost.map(normalizePlayer);
  setRoomPlayers(code, normalized);
  return normalized;
}

function upsertCurrentPlayer(code, nickname, playerId) {
  const name = nickname.trim() || getTabPlayerName() || FALLBACK_NICKNAME;
  setTabPlayerName(name);

  const currentPlayers = pruneStalePlayers(getRoomPlayers(code));
  const byId = new Map(currentPlayers.map((player) => [player.id, player]));
  const now = Date.now();
  const existing = byId.get(playerId);

  if (existing) {
    byId.set(playerId, {
      ...existing,
      name,
      lastSeen: now,
    });
  } else if (currentPlayers.length >= MAX_PLAYERS) {
    return currentPlayers.map(normalizePlayer);
  } else {
    const avatarSlot = getTabPlayerAvatarSlot() ?? pickAvatarSlot(Array.from(byId.values()));
    setTabPlayerAvatarSlot(avatarSlot);

    byId.set(playerId, {
      id: playerId,
      playerId,
      name,
      avatarSlot,
      isHost: false,
      joinedAt: now,
      lastSeen: now,
    });
  }

  return commitPlayers(code, Array.from(byId.values()));
}

export function getDisplayPlayers(code) {
  return ensureHost(pruneStalePlayers(getRoomPlayers(code))).map(normalizePlayer);
}

export function ensureTabPlayerInRoom(code, nickname) {
  if (!code) return [];

  const playerId = resolveTabPlayerIdForRoom(code, (roomCode) =>
    pruneStalePlayers(getRoomPlayers(roomCode)),
  );

  return upsertCurrentPlayer(code, nickname, playerId);
}

export function touchTabPlayerHeartbeat(code, nickname) {
  if (!code) return [];
  return upsertCurrentPlayer(code, nickname, getTabPlayerId());
}

export function removeTabPlayerFromRoom(code) {
  if (!code) return [];

  const playerId = getTabPlayerId();
  const remaining = pruneStalePlayers(getRoomPlayers(code)).filter(
    (player) => player.id !== playerId,
  );
  const next = commitPlayers(code, remaining);
  clearTabRoomBinding();
  return next;
}

export function isTabPlayerHost(players, tabPlayerId) {
  return players.some((player) => player.id === tabPlayerId && player.isHost);
}
