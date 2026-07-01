const NICKNAME_KEY = 'party_nickname';
const ROLE_KEY = 'party_room_role';
const CREATED_ROOM_KEY = 'party_created_room';

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
