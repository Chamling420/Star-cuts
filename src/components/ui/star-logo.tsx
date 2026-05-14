'use client'

import { cn } from '@/lib/utils'

interface StarLogoProps {
  className?: string
  size?: number
  showText?: boolean
}

/**
 * Modern professional logo for Star Cuts Beauty Salon
 * Features an elegant star with integrated scissor/shear motif,
 * flowing hair curves, and a refined circular badge design
 */
export function StarLogo({ className, size = 40, showText = false }: StarLogoProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <defs>
          {/* Primary rose-gold gradient */}
          <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e8a87c" />
            <stop offset="35%" stopColor="#d4845f" />
            <stop offset="70%" stopColor="#c96b8e" />
            <stop offset="100%" stopColor="#be123c" />
          </linearGradient>

          {/* Gold accent gradient */}
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5d5a0" />
            <stop offset="50%" stopColor="#d4a55a" />
            <stop offset="100%" stopColor="#b8860b" />
          </linearGradient>

          {/* Inner star fill */}
          <linearGradient id="starFill" x1="20%" y1="20%" x2="80%" y2="80%">
            <stop offset="0%" stopColor="#fcd5ce" />
            <stop offset="40%" stopColor="#f0b8a8" />
            <stop offset="100%" stopColor="#d4845f" />
          </linearGradient>

          {/* Subtle shadow filter */}
          <filter id="logoShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#be123c" floodOpacity="0.25" />
          </filter>

          {/* Clip for inner content */}
          <clipPath id="circleClip">
            <circle cx="60" cy="60" r="50" />
          </clipPath>
        </defs>

        {/* Outer ring - double stroke for premium feel */}
        <circle cx="60" cy="60" r="56" stroke="url(#brandGradient)" strokeWidth="2" fill="none" opacity="0.4" />
        <circle cx="60" cy="60" r="52" stroke="url(#goldGradient)" strokeWidth="3.5" fill="none" filter="url(#logoShadow)" />

        {/* Inner fill circle - subtle */}
        <circle cx="60" cy="60" r="49" fill="url(#brandGradient)" opacity="0.06" />

        {/* Main star shape - refined 5-point star */}
        <path
          d="M60 16 L67.2 40.5 L92 40.5 L72 55.8 L79.5 80 L60 65.5 L40.5 80 L48 55.8 L28 40.5 L52.8 40.5 Z"
          fill="url(#starFill)"
          stroke="url(#brandGradient)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          filter="url(#logoShadow)"
        />

        {/* Scissor/shear motif integrated into the star */}
        {/* Left blade */}
        <path
          d="M54 34 L46 52 Q44 56 46 58 L50 56 L56 40 Z"
          fill="url(#goldGradient)"
          opacity="0.7"
        />
        {/* Right blade */}
        <path
          d="M66 34 L74 52 Q76 56 74 58 L70 56 L64 40 Z"
          fill="url(#goldGradient)"
          opacity="0.7"
        />
        {/* Pivot point */}
        <circle cx="60" cy="46" r="2.5" fill="url(#goldGradient)" />
        {/* Scissor handles */}
        <ellipse cx="47" cy="62" rx="5" ry="7" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" opacity="0.5" />
        <ellipse cx="73" cy="62" rx="5" ry="7" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" opacity="0.5" />

        {/* Flowing hair curves at bottom */}
        <path
          d="M28 82 Q38 90 48 86 Q54 83 60 87 Q66 91 72 86 Q82 80 92 88"
          stroke="url(#brandGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <path
          d="M24 90 Q36 97 46 93 Q54 89 60 94 Q66 99 74 93 Q84 87 96 95"
          stroke="url(#brandGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />

        {/* Decorative sparkle dots */}
        <circle cx="88" cy="22" r="2.2" fill="url(#goldGradient)" opacity="0.9" />
        <circle cx="93" cy="28" r="1.3" fill="url(#goldGradient)" opacity="0.6" />
        <circle cx="32" cy="24" r="1.5" fill="url(#brandGradient)" opacity="0.5" />
      </svg>

      {showText && (
        <div className="flex flex-col leading-tight">
          <span className="text-lg font-bold text-gradient">Star Cuts</span>
          <span className="text-[10px] font-medium text-muted-foreground">Beauty Salon</span>
        </div>
      )}
    </div>
  )
}
