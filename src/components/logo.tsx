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
      <path
        d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"
        fill="hsl(var(--primary))"
        stroke="hsl(var(--primary))"
        strokeWidth="0.5"
      />
      <path
        d="M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"
        fill="hsl(var(--destructive))"
        stroke="hsl(var(--destructive))"
         strokeWidth="0.5"
      />
      <path
        d="M8.5 7l3.5 10 3.5-10 1 .8L12 19 7.5 7.8z"
        fill="hsl(var(--accent))"
        stroke="hsl(var(--accent))"
        strokeWidth="0.5"
      />
    </svg>
  );
}
