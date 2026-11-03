export function Chevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 12 12"
      fill="none"
      style={{
        transform: expanded ? 'rotate(90deg)' : 'none',
        transition: 'transform 120ms',
      }}
      aria-hidden
    >
      <path
        d="M4 2.5L8 6l-4 3.5"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
