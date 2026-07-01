const base = import.meta.env.BASE_URL;

function avatarPath(index) {
  return `${base}avatars/avatar-${String(index).padStart(2, '0')}.png`;
}

export const AVATAR_POOL = Array.from({ length: 12 }, (_, i) => avatarPath(i + 1));

export function getPlayerAvatar(slot) {
  const index = (slot - 1) % AVATAR_POOL.length;
  return AVATAR_POOL[index >= 0 ? index : 0];
}
