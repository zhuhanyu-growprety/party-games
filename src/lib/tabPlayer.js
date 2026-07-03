const TAB_PLAYER_ID = 'party-games:tab-player-id';
const TAB_PLAYER_NAME = 'party-games:tab-player-name';
const TAB_PLAYER_AVATAR = 'party-games:tab-player-avatar';

export function getTabPlayerId() {
  let id = sessionStorage.getItem(TAB_PLAYER_ID);
  if (!id) {
    id = `tab_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(TAB_PLAYER_ID, id);
  }
  return id;
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
