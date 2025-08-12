export function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
    >
      {/* Outer Petals (Primary Color) */}
      <path
        d="M12 2C8.5 2 6 4.5 6 8c0 1.5.5 3 1.5 4.5"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
      />
      <path
        d="M12 2C15.5 2 18 4.5 18 8c0 1.5-.5 3-1.5 4.5"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
      />
      <path
        d="M6.5 17.5C7.5 16 9 14 12 14s4.5 2 5.5 3.5"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
      />
      <path
        d="M3 13.5c1-3.5 4-5 9-5s8 1.5 9 5"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
        fill="hsl(var(--primary))"
        fillOpacity="0.1"
      />

      {/* Inner Petal Details (Muted Foreground) */}
       <path
        d="M9.5 12.5c.5-1 1.5-2.5 2.5-2.5s2 1.5 2.5 2.5"
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="0.5"
        opacity="0.6"
      />
       <path
        d="M8.5 9.5a3.5 3.5 0 0 1 7 0"
        stroke="hsl(var(--muted-foreground))"
        strokeWidth="0.5"
        opacity="0.6"
      />
       <circle cx="12" cy="7.5" r="0.5" fill="hsl(var(--muted-foreground))" opacity="0.6" />

      {/* V Letter (Accent Color) */}
      <path
        d="M9.5 7 L12 12 l2.5 -5"
        stroke="hsl(var(--accent))"
        strokeWidth="1.5"
        fill="none"
      />
       <path
        d="M14.5 7l.5 -1.5"
        stroke="hsl(var(--accent))"
        strokeWidth="1"
        fill="none"
      />
       <circle cx="15.2" cy="5" r="0.4" fill="hsl(var(--accent))" />

        {/* Base */}
       <path
        d="M9 19c-3-2-3-5-1-7"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
      />
        <path
        d="M15 19c3-2 3-5 1-7"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
      />
       <path
        d="M12 22a4 4 0 0 0-4-4h8a4 4 0 0 0-4 4z"
        stroke="hsl(var(--primary))"
        strokeWidth="1"
        fill="hsl(var(--primary))"
        fillOpacity="0.1"
      />

    </svg>
  );
}
