
"use client";

import React, { useState, useEffect } from 'react';

export const Logo: React.FC<{ size?: number; className?: string }> = ({
  size = 40,
  className = '',
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div
        className={`flex justify-center items-center ${className}`}
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className={`flex justify-center items-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto"
      >
        <defs>
          <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" />
            <stop offset="50%" stopColor="hsl(var(--primary) / 0.8)" />
            <stop offset="100%" stopColor="hsl(var(--accent))" />
          </linearGradient>
          <linearGradient
            id="darkPetalGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="hsl(var(--accent))" />
            <stop offset="100%" stopColor="hsl(var(--accent) / 0.7)" />
          </linearGradient>
          <linearGradient
            id="centerGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="hsl(var(--secondary-foreground))" />
            <stop offset="100%" stopColor="hsl(var(--foreground))" />
          </linearGradient>

          <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="8"
              floodColor="hsl(var(--primary))"
              floodOpacity="0.3"
            />
          </filter>
        </defs>

        <g transform="translate(100, 100)" filter="url(#drop-shadow)">
          {isClient && <>
            {/* Outer lotus petals */}
            {[0, 60, 120, 180, 240, 300].map((angle, index) => (
              <g key={`outer-${index}`} transform={`rotate(${angle})`}>
                <path
                  d="M0 -65 C-15 -75, -25 -60, -20 -42 C-25 -25, -15 -15, 0 -20 C15 -15, 25 -25, 20 -42 C25 -60, 15 -75, 0 -65 Z"
                  fill="url(#petalGradient)"
                  stroke="hsl(var(--background))"
                  strokeWidth="1"
                  opacity="0.95"
                />
                {/* Petal detail line */}
                <path
                  d="M0 -58 Q0 -45 0 -32"
                  stroke="hsl(var(--background))"
                  strokeWidth="0.5"
                  opacity="0.4"
                />
              </g>
            ))}
            
            {/* Inner lotus petals */}
            {[30, 90, 150, 210, 270, 330].map((angle, index) => (
              <g key={`inner-${index}`} transform={`rotate(${angle})`}>
                <path
                  d="M0 -42 C-12 -50, -18 -38, -15 -26 C-18 -14, -12 -8, 0 -12 C12 -8, 18 -14, 15 -26 C18 -38, 12 -50, 0 -42 Z"
                  fill="url(#darkPetalGradient)"
                  stroke="hsl(var(--background))"
                  strokeWidth="0.5"
                  opacity="0.9"
                />
              </g>
            ))}
          </>}
          
          {/* Center circle */}
          <circle cx="0" cy="0" r="22" fill="url(#centerGradient)" />
          
          {/* V letter in center */}
          <g transform="translate(0, 2)">
            <path
              d="M-12 -14 L-3 10 L3 10 L12 -14 L7 -14 L0 4 L-7 -14 Z"
              fill="hsl(var(--primary))"
            />
            {/* V accent highlight */}
            <path
              d="M0 -8 L2 -6 L4 -8 L2 -10 Z"
              fill="hsl(var(--background))"
              opacity="0.8"
            />
          </g>
          
          {isClient && <>
            {/* Decorative mandala pattern */}
            <g stroke="hsl(var(--primary))" strokeWidth="0.6" fill="none" opacity="0.6">
              <circle cx="0" cy="0" r="18" />
              <circle cx="0" cy="0" r="12" />
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, index) => (
                <line
                  key={`mandala-${index}`}
                  x1={12 * Math.cos((angle * Math.PI) / 180)}
                  y1={12 * Math.sin((angle * Math.PI) / 180)}
                  x2={18 * Math.cos((angle * Math.PI) / 180)}
                  y2={18 * Math.sin((angle * Math.PI) / 180)}
                />
              ))}
            </g>
            
            {/* Petal accent dots */}
            <g fill="hsl(var(--primary) / 0.8)" opacity="0.7">
              {[0, 60, 120, 180, 240, 300].map((angle, index) => (
                <circle
                  key={`dots-${index}`}
                  cx={48 * Math.cos((angle * Math.PI) / 180)}
                  cy={48 * Math.sin((angle * Math.PI) / 180)}
                  r="2"
                />
              ))}
            </g>
          </>}
        </g>
      </svg>
    </div>
  );
};
