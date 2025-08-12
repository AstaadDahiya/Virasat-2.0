export function Logo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-8 w-8"
    >
      {/* Lotus Petals - Primary Color */}
      <path
        d="M12 21c4-4 6-7 6-10A6 6 0 0 0 6 11c0 3 2 6 6 10z"
        stroke="hsl(var(--primary))"
        fill="hsl(var(--primary))"
        fillOpacity="0.2"
      />
      <path
        d="M12 12.5a6.2 6.2 0 0 1 4.5-5.5 5.2 5.2 0 0 1 4.5 5.5c-2.5 2-4.5 4-4.5 4s-2-2-4.5-4z"
        stroke="hsl(var(--primary))"
        fill="hsl(var(--primary))"
        fillOpacity="0.2"
      />
      <path
        d="M12 12.5a6.2 6.2 0 0 0-4.5-5.5A5.2 5.2 0 0 0 3 12.5c2.5 2 4.5 4 4.5 4s2-2 4.5-4z"
        stroke="hsl(var(--primary))"
        fill="hsl(var(--primary))"
        fillOpacity="0.2"
      />
       <path
        d="M8.5 12.5c0-1.5 1-3.5 3.5-3.5s3.5 2 3.5 3.5"
        stroke="hsl(var(--primary))"
        fill="none"
        strokeWidth="0.5"
      />


      {/* Henna Details - Muted Foreground */}
      <path d="M12 17.5a4 4 0 0 0-2.5-3.5" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" opacity="0.8" />
      <path d="M12 17.5a4 4 0 0 1 2.5-3.5" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" opacity="0.8" />
      <path d="M7.5 11 a2 2 0 0 1 2 -1" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" opacity="0.8" />
       <path d="M16.5 11 a2 2 0 0 0 -2 -1" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" opacity="0.8" />
       <circle cx="12" cy="12.5" r="1" fill="hsl(var(--muted-foreground))" opacity="0.5" />


      {/* V Letter - Accent Color */}
      <path
        d="M9.5 7 L12 13 l2.5 -6"
        stroke="hsl(var(--accent))"
        strokeWidth="2"
        fill="none"
      />
      {/* V Flourish */}
      <path
        d="M15.5 5.5 a 1 1 0 0 1 1 1"
        stroke="hsl(var(--accent))"
        strokeWidth="1"
        fill="none"
      />
       <circle cx="17" cy="6" r="0.5" fill="hsl(var(--accent))" />
       <circle cx="16.2" cy="4.8" r="0.3" fill="hsl(var(--accent))" />

    </svg>
  );
}