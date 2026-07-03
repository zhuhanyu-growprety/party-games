import gamesData from '../data/games.seed.json';
import { publicAsset } from './assetPaths';
import { getGameRules } from './gameRules';

const GAME_ICONS = {
  undercover: '🕵️',
  werewolf: '🐺',
  king: '👑',
  whoami: '🎭',
  garden: '🌳',
  bomb: '💣',
  'truth-dare': '🎲',
  'turtle-soup': '🐢',
  wheel: '🎡',
};


function resolveGameImage(game) {
  if (!game?.image) return game;
  const path = game.image.startsWith('/') ? game.image.slice(1) : game.image;
  return { ...game, image: publicAsset(path) };
}

export function getAllGames() {
  return gamesData.map(resolveGameImage);
}

export function getGameById(id) {
  const game = gamesData.find((g) => g.id === id);
  return game ? resolveGameImage(game) : null;
}

export function getGameIcon(id) {
  return GAME_ICONS[id] ?? '🎮';
}

export function getPlaceholderHint(id) {
  return getGameRules(id)?.summary ?? '该游戏面板正在建设中。';
}
