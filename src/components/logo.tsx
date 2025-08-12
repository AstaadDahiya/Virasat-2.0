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
      {/* Outer Lotus Petals */}
      <path d="M12 21.5c3-2 5-5 5-9.5A5.5 5.5 0 0 0 12 7a5.5 5.5 0 0 0-5 5c0 4.5 2 7.5 5 9.5z" strokeWidth="1" fill="hsl(var(--primary))" stroke="hsl(var(--primary))"/>

      {/* Inner V shape */}
      <path d="M10 10l2 5 2-5" strokeWidth="2.5" stroke="hsl(var(--primary-foreground))"/>
      
      {/* Side details - simplified */}
      <path d="M7.5 12c-1.5 1.5-1.5 4 0 5.5" stroke="hsl(var(--primary))"/>
      <path d="M16.5 12c1.5 1.5 1.5 4 0 5.5" stroke="hsl(var(--primary))"/>

       {/* Top Flourish */}
      <path d="M12 7a1 1 0 0 1-1-1V5a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1z" stroke="hsl(var(--primary))" strokeWidth="0.5"/>
       <path d="M11 5.5h2" stroke="hsl(var(--primary))" strokeWidth="1"/>

    </svg>
  );
}
