export function LogoMark({ className = "logo-mark" }: { className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      <svg viewBox="0 0 64 64">
        <rect width="64" height="64" rx="14" fill="var(--palm)" />
        <g className="waves" fill="none" stroke="#f5f3ec" strokeWidth="3.6" strokeLinecap="round">
          <path pathLength={1} d="M11 22 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t2 0" />
          <path pathLength={1} d="M11 33 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t2 0" />
          <path pathLength={1} d="M11 44 q2.5 -3 5 0 t5 0 t5 0 t5 0 t5 0 t5 0" />
        </g>
      </svg>
    </span>
  );
}
