export default function PartyLineArt() {
  return (
    <svg
      className="party-line-art"
      viewBox="0 0 420 340"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="line-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="line-pink" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#db2777" />
        </linearGradient>
        <linearGradient id="line-orange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="line-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
        <filter id="glow-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* stars */}
      <circle cx="48" cy="42" r="2" fill="#a78bfa" opacity="0.7" />
      <circle cx="360" cy="58" r="1.5" fill="#f472b6" opacity="0.6" />
      <circle cx="310" cy="28" r="2" fill="#fbbf24" opacity="0.5" />
      <path d="M88 72 L89.5 76 L94 76 L90.5 78.5 L92 83 L88 80.5 L84 83 L85.5 78.5 L82 76 L86.5 76 Z" fill="#c4b5fd" opacity="0.55" />
      <path d="M340 110 L341 112.5 L343.5 112.5 L341.5 114 L342.5 116.5 L340 115 L337.5 116.5 L338.5 114 L336.5 112.5 L339 112.5 Z" fill="#fda4af" opacity="0.5" />

      {/* ground arc */}
      <ellipse cx="210" cy="290" rx="160" ry="18" stroke="url(#line-purple)" strokeWidth="1" opacity="0.25" />

      {/* person left */}
      <g stroke="url(#line-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-soft)">
        <circle cx="72" cy="148" r="18" />
        <path d="M72 166 L72 228 M72 192 L48 218 M72 192 L96 210" />
        <path d="M58 248 L72 228 L86 248" />
      </g>

      {/* person left-center */}
      <g stroke="url(#line-pink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-soft)">
        <circle cx="138" cy="128" r="16" />
        <path d="M138 144 L138 200 M138 168 L118 188 M138 168 L158 182" />
        <path d="M124 218 L138 200 L152 218" />
      </g>

      {/* person right */}
      <g stroke="url(#line-blue)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" filter="url(#glow-soft)">
        <circle cx="318" cy="136" r="17" />
        <path d="M318 153 L318 215 M318 175 L296 198 M318 175 L340 190" />
        <path d="M304 234 L318 215 L332 234" />
      </g>

      {/* person right-back */}
      <g stroke="url(#line-orange)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
        <circle cx="358" cy="168" r="14" />
        <path d="M358 182 L358 232 M358 200 L342 218 M358 200 L374 212" />
        <path d="M346 248 L358 232 L370 248" />
      </g>

      {/* phone center */}
      <g filter="url(#glow-soft)">
        <rect x="186" y="158" width="48" height="78" rx="8" stroke="url(#line-purple)" strokeWidth="2" fill="rgba(124,58,237,0.08)" />
        <rect x="192" y="166" width="36" height="54" rx="4" stroke="url(#line-pink)" strokeWidth="1.2" opacity="0.7" />
        <circle cx="210" cy="228" r="3" fill="#a78bfa" opacity="0.6" />
        <path d="M200 178 L220 178 M200 186 L216 186 M200 194 L218 194" stroke="url(#line-blue)" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* speech bubbles */}
      <g stroke="url(#line-pink)" strokeWidth="1.5" fill="rgba(219,39,119,0.06)">
        <rect x="108" y="88" width="52" height="28" rx="10" />
        <path d="M124 116 L118 126 L132 116" fill="rgba(219,39,119,0.06)" stroke="url(#line-pink)" />
        <path d="M118 100 L128 100 M118 106 L134 106" stroke="url(#line-pink)" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      </g>

      <g stroke="url(#line-orange)" strokeWidth="1.5" fill="rgba(251,146,60,0.06)">
        <rect x="268" y="96" width="56" height="30" rx="10" />
        <path d="M296 126 L290 136 L304 126" fill="rgba(251,146,60,0.06)" stroke="url(#line-orange)" />
        <path d="M278 108 L290 108 M278 114 L306 114" stroke="url(#line-orange)" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* connecting lines / energy */}
      <path d="M120 200 Q168 180 186 198" stroke="url(#line-purple)" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
      <path d="M300 200 Q252 182 234 198" stroke="url(#line-blue)" strokeWidth="1" strokeDasharray="4 4" opacity="0.35" />
    </svg>
  );
}
