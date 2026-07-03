import { generateRoomCode } from './room';
import { setNickname, setRoomRole, setCreatedRoomCode } from './storage';

export function createRoomPath(code, gameId) {
  const base = `/room/${code}`;
  if (gameId) return `${base}?game=${encodeURIComponent(gameId)}`;
  return base;
}

export function startHostRoom(navigate, nickname, gameId = null) {
  if (nickname?.trim()) {
    setNickname(nickname);
  }
  const code = generateRoomCode();
  setRoomRole('host');
  setCreatedRoomCode(code);
  navigate(createRoomPath(code, gameId));
}
