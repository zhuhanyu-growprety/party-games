const NICKNAME_KEY = 'party_nickname';
const ROLE_KEY = 'party_room_role';
const CREATED_ROOM_KEY = 'party_created_room';
const PLAYER_ID_KEY = 'party_player_id';
const ROOM_PLAYERS_KEY = 'party_room_players';

export function getNickname() {
  return localStorage.getItem(NICKNAME_KEY) || '';
}

export function setNickname(name) {
  localStorage.setItem(NICKNAME_KEY, name.trim());
}

export function getRoomRole() {
  return localStorage.getItem(ROLE_KEY) || 'member';
}

export function setRoomRole(role) {
  localStorage.setItem(ROLE_KEY, role);
}

export function getCreatedRoomCode() {
  return localStorage.getItem(CREATED_ROOM_KEY) || '';
}

export function setCreatedRoomCode(code) {
  localStorage.setItem(CREATED_ROOM_KEY, code);
}

export function getPlayerId() {
  let id = localStorage.getItem(PLAYER_ID_KEY);
  if (!id) {
    id = `local_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem(PLAYER_ID_KEY, id);
  }
  return id;
}

export function getRoomPlayersMap() {
  try {
    return JSON.parse(localStorage.getItem(ROOM_PLAYERS_KEY) || '{}');
  } catch {
    return {};
  }
}

export function getRoomPlayers(code) {
  return getRoomPlayersMap()[code] || [];
}

export function setRoomPlayers(code, players) {
  const map = getRoomPlayersMap();
  map[code] = players;
  localStorage.setItem(ROOM_PLAYERS_KEY, JSON.stringify(map));
}
