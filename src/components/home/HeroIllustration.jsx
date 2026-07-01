export default function HeroIllustration() {
  return (
    <svg
      className="hero-illustration"
      viewBox="0 0 520 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-stroke-purple" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="hero-stroke-pink" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f9a8d4" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
        <linearGradient id="hero-stroke-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="hero-stroke-cyan" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#67e8f9" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="hero-stroke-orange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="hero-stroke-gold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <filter id="hero-neon" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ambient dots */}
      <circle cx="42" cy="52" r="2" fill="#a78bfa" opacity="0.6" />
      <circle cx="468" cy="68" r="1.5" fill="#f472b6" opacity="0.5" />
      <circle cx="400" cy="36" r="2" fill="#fbbf24" opacity="0.45" />
      <path d="M76 88 L77.2 91 L80.5 91 L78 93 L79 96 L76 94.2 L73 96 L74 93 L71.5 91 L74.8 91 Z" fill="#c4b5fd" opacity="0.5" />

      {/* music notes */}
      <g stroke="url(#hero-stroke-gold)" strokeWidth="1.5" strokeLinecap="round" opacity="0.7">
        <ellipse cx="448" cy="118" rx="5" ry="4" fill="none" />
        <path d="M453 118 L453 98" />
        <ellipse cx="462" cy="108" rx="4" ry="3.5" fill="none" />
        <path d="M466 108 L466 92" />
        <path d="M453 98 Q458 94 466 92" />
      </g>

      {/* heart speech bubble */}
      <g filter="url(#hero-neon)">
        <rect x="58" y="108" width="64" height="36" rx="14" stroke="url(#hero-stroke-pink)" strokeWidth="1.5" fill="rgba(236,72,153,0.06)" />
        <path d="M82 144 L76 156 L88 144" fill="rgba(236,72,153,0.06)" stroke="url(#hero-stroke-pink)" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M88 126 C88 122 84 120 82 123 C80 120 76 122 76 126 C76 130 82 134 82 134 C82 134 88 130 88 126 Z" fill="none" stroke="url(#hero-stroke-pink)" strokeWidth="1.3" />
      </g>

      {/* table */}
      <ellipse cx="260" cy="268" rx="148" ry="42" stroke="url(#hero-stroke-purple)" strokeWidth="1.5" opacity="0.35" fill="rgba(124,58,237,0.04)" />
      <ellipse cx="260" cy="264" rx="120" ry="28" stroke="url(#hero-stroke-blue)" strokeWidth="1" opacity="0.2" />

      {/* person 1 — left, seated, leaning in */}
      <g strokeLinecap="round" strokeLinejoin="round" filter="url(#hero-neon)">
        <g stroke="url(#hero-stroke-pink)" strokeWidth="1.8" fill="none">
          <ellipse cx="108" cy="198" rx="20" ry="22" />
          <path d="M98 186 Q92 178 100 172 Q108 168 116 174" />
          <path d="M108 220 C108 248 100 268 88 286" />
          <path d="M108 238 C118 252 128 262 138 272" />
          <path d="M108 238 C96 250 82 258 72 268" />
          <path d="M72 268 L68 282 M138 272 L144 286" />
          <path d="M118 228 C124 218 130 212 142 208" />
        </g>
      </g>

      {/* person 2 — back left */}
      <g stroke="url(#hero-stroke-blue)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#hero-neon)">
        <ellipse cx="168" cy="168" rx="18" ry="20" />
        <path d="M160 156 Q154 148 162 144 Q172 140 178 148" />
        <path d="M168 188 C168 214 162 234 154 252" />
        <path d="M168 210 C178 222 188 232 198 242" />
        <path d="M168 210 C156 220 146 228 136 238" />
        <path d="M182 196 C190 188 200 182 214 178" />
      </g>

      {/* person 3 — right, phone */}
      <g stroke="url(#hero-stroke-orange)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#hero-neon)">
        <ellipse cx="372" cy="192" rx="19" ry="21" />
        <path d="M362 180 Q356 172 366 168 Q376 164 384 172" />
        <path d="M372 213 C372 240 380 258 392 276" />
        <path d="M372 232 C360 244 348 254 336 266" />
        <path d="M372 232 C384 246 396 258 408 268" />
        <path d="M358 218 C348 210 340 204 328 200" />
        {/* phone */}
        <rect x="318" y="188" width="22" height="36" rx="4" stroke="url(#hero-stroke-cyan)" strokeWidth="1.5" />
        <path d="M322 196 L336 196 M322 202 L334 202" stroke="url(#hero-stroke-cyan)" strokeWidth="1" />
      </g>

      {/* person 4 — front right, phone */}
      <g stroke="url(#hero-stroke-cyan)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" filter="url(#hero-neon)">
        <ellipse cx="418" cy="228" rx="17" ry="19" />
        <path d="M410 216 Q404 210 412 206 Q420 202 426 210" />
        <path d="M418 247 C418 270 426 286 436 300" />
        <path d="M418 262 C406 274 394 282 382 292" />
        <path d="M418 262 C430 276 442 286 454 296" />
        <path d="M404 248 C396 238 388 232 376 226" />
        <rect x="364" y="222" width="20" height="34" rx="3.5" stroke="url(#hero-stroke-purple)" strokeWidth="1.5" />
        <circle cx="374" cy="250" r="2" fill="#a78bfa" opacity="0.5" />
      </g>

      {/* center phone on table */}
      <g filter="url(#hero-neon)">
        <rect x="244" y="238" width="32" height="52" rx="6" stroke="url(#hero-stroke-purple)" strokeWidth="1.6" fill="rgba(124,58,237,0.08)" />
        <rect x="249" y="244" width="22" height="36" rx="3" stroke="url(#hero-stroke-pink)" strokeWidth="1" opacity="0.6" />
        <path d="M252 252 L268 252 M252 258 L266 258" stroke="url(#hero-stroke-blue)" strokeWidth="0.8" strokeLinecap="round" opacity="0.5" />
      </g>

      {/* chat bubble right */}
      <g stroke="url(#hero-stroke-blue)" strokeWidth="1.4" fill="rgba(59,130,246,0.05)" filter="url(#hero-neon)">
        <rect x="388" y="118" width="58" height="30" rx="12" />
        <path d="M412 148 L406 158 L420 148" fill="rgba(59,130,246,0.05)" stroke="url(#hero-stroke-blue)" strokeWidth="1.4" />
        <path d="M398 130 L410 130 M398 136 L424 136" strokeWidth="1" strokeLinecap="round" opacity="0.55" />
      </g>

      {/* soft ground glow */}
      <ellipse cx="260" cy="318" rx="180" ry="24" fill="url(#hero-stroke-purple)" opacity="0.06" />
    </svg>
  );
}
