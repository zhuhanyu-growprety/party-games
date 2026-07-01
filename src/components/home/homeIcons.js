import {
  Search,
  Moon,
  Crown,
  Drama,
  Trees,
  Bomb,
  Dices,
  CircleHelp,
  CircleDot,
  Globe,
  Layers,
  KeyRound,
  Users,
  Sparkles,
} from 'lucide-react';

const GAME_ICON_MAP = {
  undercover: Search,
  werewolf: Moon,
  king: Crown,
  whoami: Drama,
  garden: Trees,
  bomb: Bomb,
  'truth-dare': Dices,
  'turtle-soup': CircleHelp,
  wheel: CircleDot,
};

export function getHomeGameIcon(id) {
  return GAME_ICON_MAP[id] ?? Sparkles;
}

export const FEATURE_ICONS = [Globe, Layers, KeyRound, Users];
