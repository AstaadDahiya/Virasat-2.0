export function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 260 200"
      className="h-10 w-auto"
      fill="none"
    >
      <defs>
        <linearGradient id="petalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
        <linearGradient id="centerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--accent))" />
          <stop offset="100%" stopColor="hsl(var(--primary))" />
        </linearGradient>
        <radialGradient id="mandalaGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </radialGradient>
      </defs>
      <g transform="translate(130, 100)">
        <circle
          cx="0"
          cy="0"
          r="85"
          fill="none"
          stroke="url(#mandalaGradient)"
          strokeWidth="3"
          opacity="0.3"
        />
        <g>
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <g key={angle} transform={`rotate(${angle})`}>
              <path
                d="M0 -65 C-15 -75, -25 -60, -20 -45 C-25 -30, -15 -20, 0 -25 C15 -20, 25 -30, 20 -45 C25 -60, 15 -75, 0 -65 Z"
                fill="url(#petalGradient)"
                stroke="hsl(var(--background))"
                strokeWidth="1.5"
                opacity="0.9"
              />
            </g>
          ))}
          {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(
            (angle) => (
              <g key={angle} transform={`rotate(${angle})`}>
                <path
                  d="M0 -45 C-12 -52, -18 -40, -15 -30 C-18 -18, -12 -12, 0 -15 C12 -12, 18 -18, 15 -30 C18 -40, 12 -52, 0 -45 Z"
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--background))"
                  strokeWidth="1"
                  opacity="0.8"
                />
              </g>
            )
          )}
        </g>
        <circle cx="0" cy="0" r="18" fill="url(#centerGradient)" />
        <g fill="hsl(var(--primary-foreground))" opacity="0.9">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <g key={angle} transform={`rotate(${angle})`}>
              <path d="M0 -12 C-3 -15, -6 -12, -4 -8 C-6 -4, -3 -2, 0 -4 C3 -2, 6 -4, 4 -8 C6 -12, 3 -15, 0 -12 Z" />
            </g>
          ))}
          <circle cx="0" cy="0" r="3" fill="hsl(var(--background))" />
        </g>
      </g>
    </svg>
  );
}
