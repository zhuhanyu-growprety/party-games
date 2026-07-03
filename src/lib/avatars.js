import { publicAsset } from './assetPaths';

export const AVATAR_POOL = Array.from({ length: 12 }, (_, i) =>
  publicAsset(`avatars/avatar-${String(i + 1).padStart(2, '0')}.png`),
);

export function getPlayerAvatar(slot) {
  const index = (slot - 1) % AVATAR_POOL.length;
  return AVATAR_POOL[index >= 0 ? index : 0];
}
