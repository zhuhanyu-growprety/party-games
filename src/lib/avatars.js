export const AVATAR_POOL = [
  '/avatars/avatar-01.png',
  '/avatars/avatar-02.png',
  '/avatars/avatar-03.png',
  '/avatars/avatar-04.png',
  '/avatars/avatar-05.png',
  '/avatars/avatar-06.png',
  '/avatars/avatar-07.png',
  '/avatars/avatar-08.png',
  '/avatars/avatar-09.png',
  '/avatars/avatar-10.png',
  '/avatars/avatar-11.png',
  '/avatars/avatar-12.png',
];

export function getPlayerAvatar(playerId) {
  const index = (playerId - 1) % AVATAR_POOL.length;
  return AVATAR_POOL[index >= 0 ? index : 0];
}
