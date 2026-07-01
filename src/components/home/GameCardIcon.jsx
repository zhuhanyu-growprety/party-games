const ICONS = {
  undercover: (
    <>
      <circle cx="32" cy="22" r="8" />
      <circle cx="48" cy="26" r="8" />
      <path d="M24 38 C28 48 36 52 40 52 C44 52 52 48 56 38" />
      <path d="M40 52 L40 58" />
      <path d="M52 18 L58 12 M58 12 L64 14" strokeLinecap="round" />
      <text x="54" y="16" fill="currentColor" fontSize="10" fontWeight="700" stroke="none">?</text>
    </>
  ),
  werewolf: (
    <>
      <circle cx="48" cy="18" r="10" opacity="0.7" />
      <path d="M48 28 L48 14 M42 20 L48 16 L54 20" strokeLinecap="round" />
      <path d="M18 42 C22 34 30 30 38 32 C42 28 50 28 56 34 C62 30 70 34 74 42 C76 48 72 56 64 58 L58 62 L52 58 L46 62 L40 58 C32 56 28 48 30 42 Z" />
      <path d="M28 38 L22 32 M30 36 L24 30" strokeLinecap="round" />
      <path d="M68 38 L74 32 M66 36 L72 30" strokeLinecap="round" />
      <circle cx="34" cy="40" r="2" fill="currentColor" stroke="none" />
      <circle cx="50" cy="40" r="2" fill="currentColor" stroke="none" />
    </>
  ),
  king: (
    <>
      <path d="M20 50 L24 34 L32 42 L40 28 L48 42 L56 34 L60 50 Z" />
      <rect x="22" y="50" width="36" height="6" rx="1" />
      <circle cx="40" cy="22" r="4" />
      <path d="M40 26 L40 30" />
    </>
  ),
  whoami: (
    <>
      <circle cx="40" cy="24" r="12" />
      <path d="M28 48 C30 40 36 36 40 36 C44 36 50 40 52 48" />
      <rect x="30" y="8" width="20" height="14" rx="3" />
      <text x="36" y="18" fill="currentColor" fontSize="9" fontWeight="700" stroke="none">?</text>
    </>
  ),
  garden: (
    <>
      <path d="M20 56 L20 40 C20 32 28 28 32 34 C36 28 44 32 44 40 L44 56" />
      <path d="M48 56 L48 36 C48 28 56 24 60 30 C64 24 72 28 72 36 L72 56" />
      <path d="M14 56 L78 56" strokeLinecap="round" />
      <path d="M58 20 L62 12 L66 20" strokeLinecap="round" />
    </>
  ),
  bomb: (
    <>
      <circle cx="36" cy="38" r="16" />
      <path d="M44 24 L50 16 M50 16 L56 18" strokeLinecap="round" />
      <circle cx="56" cy="16" r="3" fill="currentColor" stroke="none" opacity="0.8" />
      <text x="28" y="44" fill="currentColor" fontSize="12" fontWeight="700" stroke="none" fontFamily="monospace">00</text>
    </>
  ),
  'truth-dare': (
    <>
      <circle cx="28" cy="30" r="10" />
      <circle cx="52" cy="30" r="10" />
      <path d="M18 48 C22 42 26 40 28 40 C30 40 34 42 38 48" />
      <path d="M42 48 C46 42 50 40 52 40 C54 40 58 42 62 48" />
      <path d="M40 18 C40 14 42 12 44 14 C46 12 48 14 48 18 C48 22 44 24 44 24 C44 24 40 22 40 18 Z" fill="currentColor" stroke="none" opacity="0.7" />
    </>
  ),
  'turtle-soup': (
    <>
      <ellipse cx="40" cy="44" rx="24" ry="10" />
      <path d="M20 44 C20 32 30 24 40 24 C50 24 60 32 60 44" />
      <path d="M32 20 C34 14 38 12 40 14 C42 12 46 14 48 20" strokeLinecap="round" opacity="0.6" />
      <path d="M28 30 C32 28 36 30 40 28 C44 30 48 28 52 30" strokeLinecap="round" opacity="0.5" />
    </>
  ),
  wheel: (
    <>
      <circle cx="40" cy="36" r="22" />
      <circle cx="40" cy="36" r="6" />
      <path d="M40 14 L40 36 M40 36 L56 48 M40 36 L24 48 M40 36 L56 24 M40 36 L24 24" strokeLinecap="round" opacity="0.7" />
      <circle cx="40" cy="14" r="3" fill="currentColor" stroke="none" opacity="0.6" />
      <circle cx="56" cy="24" r="3" fill="currentColor" stroke="none" opacity="0.6" />
      <circle cx="56" cy="48" r="3" fill="currentColor" stroke="none" opacity="0.6" />
    </>
  ),
};

export default function GameCardIcon({ gameId }) {
  return (
    <svg
      className="game-card-icon-svg"
      viewBox="0 0 80 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {ICONS[gameId] ?? ICONS.werewolf}
      </g>
    </svg>
  );
}
