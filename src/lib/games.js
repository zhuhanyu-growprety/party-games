import gamesData from '../data/games.seed.json';
import { publicAsset } from './assetPaths';

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

const PLACEHOLDER_HINTS = {
  undercover: '后续支持房间内发词，每个人只看到自己的词。',
  king: '后续支持随机分配国王和编号。',
  whoami: '后续支持给玩家分配身份词。',
  garden: '后续支持随机生成主题，现场口头接龙。',
  bomb: '后续支持生成炸弹数字并维护范围。',
  'truth-dare': '后续支持随机抽取真心话或大冒险。',
  'turtle-soup': '后续支持汤面题库和主持人答案。',
  wheel: '后续支持自定义选项并随机抽取。',
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
  return PLACEHOLDER_HINTS[id] ?? '该游戏面板正在建设中。';
}
