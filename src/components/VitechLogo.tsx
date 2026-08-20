import React from 'react';

interface VitechLogoProps {
  variant?: 'badge' | 'horizontal' | 'shield' | 'icon';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  theme?: 'dark' | 'light' | 'auto';
  className?: string;
  showTagline?: boolean;
}

export const VitechLogo: React.FC<VitechLogoProps> = ({
  variant = 'horizontal',
  size = 'md',
  theme = 'auto',
  className = '',
  showTagline = true,
}) => {
  // Dimension mapping
  const sizeMap = {
    xs: { badge: 'w-6 h-6', shield: 'w-5 h-5', textTitle: 'text-sm', textSub: 'text-[9px]' },
    sm: { badge: 'w-8 h-8', shield: 'w-7 h-7', textTitle: 'text-base', textSub: 'text-[10px]' },
    md: { badge: 'w-10 h-10', shield: 'w-9 h-9', textTitle: 'text-lg', textSub: 'text-[11px]' },
    lg: { badge: 'w-14 h-14', shield: 'w-12 h-12', textTitle: 'text-xl', textSub: 'text-xs' },
    xl: { badge: 'w-20 h-20', shield: 'w-16 h-16', textTitle: 'text-2xl', textSub: 'text-sm' },
    '2xl': { badge: 'w-32 h-32', shield: 'w-24 h-24', textTitle: 'text-3xl', textSub: 'text-base' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Pure SVG Shield Component (Vector exact replica of official logo)
  const ShieldSVG = ({ idPrefix = 'vitech' }: { idPrefix?: string }) => (
    <svg
      viewBox="0 0 512 512"
      className="w-full h-full drop-shadow-md"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Radial Dark Canvas */}
        <radialGradient id={`${idPrefix}-bg`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0a101d" />
          <stop offset="100%" stopColor="#020408" />
        </radialGradient>
        
        {/* Outer Ring */}
        <linearGradient id={`${idPrefix}-ring`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0066ff" />
          <stop offset="40%" stopColor="#00d2ff" />
          <stop offset="60%" stopColor="#00e676" />
          <stop offset="100%" stopColor="#00b04f" />
        </linearGradient>

        {/* Shield Half Colors */}
        <linearGradient id={`${idPrefix}-shieldBlue`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0052d4" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        
        <linearGradient id={`${idPrefix}-shieldGreen`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="50%" stopColor="#00e676" />
          <stop offset="100%" stopColor="#064e3b" />
        </linearGradient>

        {/* Metallic 3D Silver */}
        <linearGradient id={`${idPrefix}-silver`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="25%" stopColor="#cbd5e1" />
          <stop offset="50%" stopColor="#64748b" />
          <stop offset="75%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>

        <clipPath id={`${idPrefix}-leftClip`}>
          <path d="M 256 70 C 256 70 145 80 145 130 C 145 225 210 285 256 315 Z" />
        </clipPath>
        <clipPath id={`${idPrefix}-rightClip`}>
          <path d="M 256 70 C 256 70 367 80 367 130 C 367 225 302 285 256 315 Z" />
        </clipPath>
      </defs>

      {/* Outer Ring */}
      <circle cx="256" cy="256" r="248" fill={`url(#${idPrefix}-bg)`} />
      <circle cx="256" cy="256" r="242" fill="none" stroke={`url(#${idPrefix}-ring)`} strokeWidth="7" />

      {/* SHIELD BODY */}
      <g transform="translate(0, -10)">
        {/* Left (Blue) */}
        <path
          d="M 256 70 C 256 70 145 80 145 130 C 145 225 210 285 256 315 Z"
          fill={`url(#${idPrefix}-shieldBlue)`}
          stroke="#38bdf8"
          strokeWidth="3.5"
        />
        {/* Right (Green) */}
        <path
          d="M 256 70 C 256 70 367 80 367 130 C 367 225 302 285 256 315 Z"
          fill={`url(#${idPrefix}-shieldGreen)`}
          stroke="#4ade80"
          strokeWidth="3.5"
        />
        {/* Center Cut */}
        <line x1="256" y1="70" x2="256" y2="315" stroke="#020617" strokeWidth="3" />

        {/* Left Circuit Traces */}
        <g clipPath={`url(#${idPrefix}-leftClip)`} stroke="#67e8f9" strokeWidth="2.5" fill="none" opacity="0.9">
          <path d="M 240 85 L 200 85 L 180 110 L 180 160" />
          <circle cx="180" cy="160" r="3.5" fill="#67e8f9" />
          <circle cx="240" cy="85" r="3" fill="#67e8f9" />

          <path d="M 250 120 L 215 120 L 195 145 L 165 145 L 165 200" />
          <circle cx="165" cy="200" r="3.5" fill="#67e8f9" />

          <path d="M 245 160 L 220 185 L 180 185 L 175 220" />
          <circle cx="175" cy="220" r="3.5" fill="#67e8f9" />

          <path d="M 250 200 L 230 220 L 200 220 L 190 250" />
          <circle cx="190" cy="250" r="3" fill="#67e8f9" />

          <path d="M 250 240 L 235 255 L 215 255 L 210 280" />
          <circle cx="210" cy="280" r="2.5" fill="#67e8f9" />
        </g>

        {/* Right Circuit Traces & Gear */}
        <g clipPath={`url(#${idPrefix}-rightClip)`}>
          {/* Gear */}
          <g transform="translate(305, 120)" fill="none">
            <circle cx="0" cy="0" r="26" fill="#090d16" stroke="#e2e8f0" strokeWidth="4" />
            <circle cx="0" cy="0" r="10" fill="#e2e8f0" />
            <rect x="-4" y="-34" width="8" height="10" rx="1.5" fill="#e2e8f0" />
            <rect x="-4" y="24" width="8" height="10" rx="1.5" fill="#e2e8f0" />
            <rect x="-34" y="-4" width="10" height="8" rx="1.5" fill="#e2e8f0" />
            <rect x="24" y="-4" width="10" height="8" rx="1.5" fill="#e2e8f0" />
            <rect x="-24" y="-24" width="8" height="9" rx="1.5" transform="rotate(45)" fill="#e2e8f0" />
            <rect x="-24" y="16" width="8" height="9" rx="1.5" transform="rotate(-45)" fill="#e2e8f0" />
            <rect x="16" y="-24" width="8" height="9" rx="1.5" transform="rotate(-45)" fill="#e2e8f0" />
            <rect x="16" y="16" width="8" height="9" rx="1.5" transform="rotate(45)" fill="#e2e8f0" />
          </g>

          {/* Green Circuit Traces */}
          <g stroke="#86efac" strokeWidth="2.5" fill="none" opacity="0.9">
            <path d="M 265 95 L 290 95 L 310 115" />
            <circle cx="265" cy="95" r="3" fill="#86efac" />

            <path d="M 260 145 L 285 145 L 320 180 L 345 180" />
            <circle cx="345" cy="180" r="3.5" fill="#86efac" />

            <path d="M 265 185 L 295 185 L 325 215 L 340 215" />
            <circle cx="340" cy="215" r="3.5" fill="#86efac" />

            <path d="M 260 225 L 280 245 L 315 245 L 320 265" />
            <circle cx="320" cy="265" r="3" fill="#86efac" />

            <path d="M 260 265 L 275 280 L 295 280" />
            <circle cx="295" cy="280" r="2.5" fill="#86efac" />
          </g>
        </g>

        {/* 3D Metallic "VI" Monogram */}
        <g transform="translate(256, 190)">
          {/* V Letter */}
          <path
            d="M -90 -65 L -45 55 L -20 55 L 2 -65 L -22 -65 L -33 15 L -68 -65 Z"
            fill={`url(#${idPrefix}-silver)`}
            stroke="#090d16"
            strokeWidth="3"
          />
          {/* I Letter */}
          <path
            d="M 12 -65 L 42 -65 L 42 55 L 12 55 Z"
            fill={`url(#${idPrefix}-silver)`}
            stroke="#090d16"
            strokeWidth="3"
          />
        </g>
      </g>

      {/* BADGE TEXT ELEMENTS */}
      <g transform="translate(256, 360)">
        <text
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          fontWeight="900"
          fontSize="46"
          letterSpacing="3"
        >
          <tspan fill="#0084ff">V&amp;I </tspan>
          <tspan fill="#ffffff">TECH</tspan>
        </text>
      </g>

      <g transform="translate(256, 396)">
        <line x1="-155" y1="-7" x2="-85" y2="-7" stroke="#00e676" strokeWidth="3.5" strokeLinecap="round" />
        <text
          textAnchor="middle"
          fontFamily="'Plus Jakarta Sans', system-ui, sans-serif"
          fontWeight="800"
          fontSize="24"
          fill="#00e676"
          letterSpacing="10"
        >
          AFRICA
        </text>
        <line x1="85" y1="-7" x2="155" y2="-7" stroke="#00e676" strokeWidth="3.5" strokeLinecap="round" />
      </g>

      <g transform="translate(256, 430)">
        <text
          textAnchor="middle"
          fontFamily="'JetBrains Mono', monospace"
          fontWeight="600"
          fontSize="13"
          fill="#94a3b8"
          letterSpacing="4"
        >
          INNOVATE <tspan fill="#0084ff">•</tspan> DEVELOP <tspan fill="#00e676">•</tspan> GROW
        </text>
      </g>

      {/* Code Wings =</>= */}
      <g transform="translate(256, 462)" stroke="#0084ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <line x1="-65" y1="0" x2="-45" y2="0" />
        <line x1="-58" y1="-5" x2="-40" y2="-5" />
        <polyline points="-32,-8 -22,0 -32,8" />
        <line x1="-10" y1="9" x2="10" y2="-9" stroke="#00e676" strokeWidth="3" />
        <polyline points="22,-8 32,0 22,8" />
        <line x1="45" y1="0" x2="65" y2="0" />
        <line x1="40" y1="-5" x2="58" y2="-5" />
      </g>
    </svg>
  );

  // Variant: Pure circular Badge
  if (variant === 'badge' || variant === 'icon') {
    return (
      <div className={`inline-block ${currentSize.badge} ${className} relative flex-shrink-0`}>
        <ShieldSVG idPrefix={`badge-${size}`} />
      </div>
    );
  }

  // Variant: Shield Only (no outer badge text)
  if (variant === 'shield') {
    return (
      <div className={`inline-block ${currentSize.shield} ${className} relative flex-shrink-0`}>
        <svg viewBox="120 40 272 290" className="w-full h-full drop-shadow-md" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="shieldBlueSolo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0052d4" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="shieldGreenSolo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#00e676" />
              <stop offset="100%" stopColor="#064e3b" />
            </linearGradient>
            <linearGradient id="silverSolo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#cbd5e1" />
              <stop offset="50%" stopColor="#64748b" />
              <stop offset="75%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
            <clipPath id="leftClipSolo">
              <path d="M 256 70 C 256 70 145 80 145 130 C 145 225 210 285 256 315 Z" />
            </clipPath>
            <clipPath id="rightClipSolo">
              <path d="M 256 70 C 256 70 367 80 367 130 C 367 225 302 285 256 315 Z" />
            </clipPath>
          </defs>

          {/* Left Shield */}
          <path d="M 256 70 C 256 70 145 80 145 130 C 145 225 210 285 256 315 Z" fill="url(#shieldBlueSolo)" stroke="#38bdf8" strokeWidth="4" />
          {/* Right Shield */}
          <path d="M 256 70 C 256 70 367 80 367 130 C 367 225 302 285 256 315 Z" fill="url(#shieldGreenSolo)" stroke="#4ade80" strokeWidth="4" />
          <line x1="256" y1="70" x2="256" y2="315" stroke="#020617" strokeWidth="3" />

          {/* Circuit left */}
          <g clipPath="url(#leftClipSolo)" stroke="#67e8f9" strokeWidth="3" fill="none" opacity="0.9">
            <path d="M 240 85 L 200 85 L 180 110 L 180 160" />
            <circle cx="180" cy="160" r="4" fill="#67e8f9" />
            <path d="M 250 120 L 215 120 L 195 145 L 165 145 L 165 200" />
            <circle cx="165" cy="200" r="4" fill="#67e8f9" />
            <path d="M 245 160 L 220 185 L 180 185 L 175 220" />
            <circle cx="175" cy="220" r="4" fill="#67e8f9" />
          </g>

          {/* Gear & Circuit right */}
          <g clipPath="url(#rightClipSolo)">
            <g transform="translate(305, 120)" fill="none">
              <circle cx="0" cy="0" r="26" fill="#090d16" stroke="#e2e8f0" strokeWidth="4" />
              <circle cx="0" cy="0" r="10" fill="#e2e8f0" />
              <rect x="-4" y="-34" width="8" height="10" rx="1.5" fill="#e2e8f0" />
              <rect x="-4" y="24" width="8" height="10" rx="1.5" fill="#e2e8f0" />
              <rect x="-34" y="-4" width="10" height="8" rx="1.5" fill="#e2e8f0" />
              <rect x="24" y="-4" width="10" height="8" rx="1.5" fill="#e2e8f0" />
            </g>
            <g stroke="#86efac" strokeWidth="3" fill="none" opacity="0.9">
              <path d="M 260 145 L 285 145 L 320 180 L 345 180" />
              <circle cx="345" cy="180" r="4" fill="#86efac" />
              <path d="M 265 185 L 295 185 L 325 215 L 340 215" />
              <circle cx="340" cy="215" r="4" fill="#86efac" />
            </g>
          </g>

          {/* 3D VI Monogram */}
          <g transform="translate(256, 190)">
            <path
              d="M -90 -65 L -45 55 L -20 55 L 2 -65 L -22 -65 L -33 15 L -68 -65 Z"
              fill="url(#silverSolo)"
              stroke="#090d16"
              strokeWidth="3.5"
            />
            <path
              d="M 12 -65 L 42 -65 L 42 55 L 12 55 Z"
              fill="url(#silverSolo)"
              stroke="#090d16"
              strokeWidth="3.5"
            />
          </g>
        </svg>
      </div>
    );
  }

  // Variant: Horizontal Header/Navbar Lockup
  return (
    <div className={`flex items-center gap-2 sm:gap-2.5 md:gap-3 shrink-0 ${className}`}>
      {/* Official Circular Shield Badge */}
      <div className="relative shrink-0 transition-transform duration-300 group-hover:scale-105">
        <div className="h-7 w-7 min-[420px]:h-8 min-[420px]:w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
          <ShieldSVG idPrefix={`horiz-${size}`} />
        </div>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center text-left select-none shrink-0">
        <div className="flex items-center gap-1 sm:gap-1.5 leading-none whitespace-nowrap">
          <span className="font-black tracking-tight text-xs min-[380px]:text-sm sm:text-base md:text-lg text-white">
            V&amp;I TECH
          </span>
          <span className="font-black tracking-tight text-xs min-[380px]:text-sm sm:text-base md:text-lg text-emerald-400">
            AFRICA
          </span>
          <span className="text-[8px] min-[380px]:text-[9px] font-black px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 tracking-wider shadow-sm">
            LTD
          </span>
        </div>

        {showTagline && (
          <div className="hidden sm:flex items-center mt-1 leading-none whitespace-nowrap">
            <span className="font-mono font-semibold text-slate-400 text-[9px] min-[480px]:text-[10px] md:text-[11px] tracking-widest uppercase">
              INNOVATE <span className="text-blue-400">•</span> DEVELOP <span className="text-emerald-400">•</span> GROW
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
