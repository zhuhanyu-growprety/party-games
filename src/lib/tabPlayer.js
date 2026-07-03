const TAB_PLAYER_ID = 'party-games:tab-player-id';
const TAB_PLAYER_NAME = 'party-games:tab-player-name';
const TAB_PLAYER_AVATAR = 'party-games:tab-player-avatar';
const TAB_INSTANCE_KEY = 'party-games:tab-instance';
const TAB_BOUND_ROOM = 'party-games:tab-bound-room';

function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function getNavigationType() {
  if (typeof performance === 'undefined') return 'navigate';
  const entry = performance.getEntriesByType('navigation')[0];
  return entry?.type ?? 'navigate';
}

export function createNewTabPlayerId() {
  const id = createId('tab');
  sessionStorage.setItem(TAB_PLAYER_ID, id);
  return id;
}

export function getTabPlayerId() {
  return sessionStorage.getItem(TAB_PLAYER_ID) || createNewTabPlayerId();
}

export function resolveTabPlayerIdForRoom(code, getRoomPlayers) {
  const navType = getNavigationType();
  const isReload = navType === 'reload';
  const boundRoom = sessionStorage.getItem(TAB_BOUND_ROOM);

  if (isReload && boundRoom === code) {
    return getTabPlayerId();
  }

  sessionStorage.setItem(TAB_INSTANCE_KEY, createId('inst'));
  sessionStorage.setItem(TAB_BOUND_ROOM, code);

  let playerId = sessionStorage.getItem(TAB_PLAYER_ID);
  const players = getRoomPlayers(code);

  if (boundRoom && boundRoom !== code) {
    playerId = createNewTabPlayerId();
  } else if (playerId && players.some((player) => player.id === playerId)) {
    playerId = createNewTabPlayerId();
  } else if (!playerId) {
    playerId = createNewTabPlayerId();
  }

  return playerId;
}

export function getTabPlayerName(fallback = '') {
  return sessionStorage.getItem(TAB_PLAYER_NAME) || fallback;
}

export function setTabPlayerName(name) {
  if (name.trim()) {
    sessionStorage.setItem(TAB_PLAYER_NAME, name.trim());
  }
}

export function getTabPlayerAvatarSlot() {
  const raw = sessionStorage.getItem(TAB_PLAYER_AVATAR);
  if (!raw) return null;
  const slot = Number(raw);
  return Number.isInteger(slot) && slot >= 1 && slot <= 12 ? slot : null;
}

export function setTabPlayerAvatarSlot(slot) {
  sessionStorage.setItem(TAB_PLAYER_AVATAR, String(slot));
}

export function clearTabRoomBinding() {
  sessionStorage.removeItem(TAB_BOUND_ROOM);
}
