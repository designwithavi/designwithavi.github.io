/** Brand marks (Lucide no longer ships them). Drawn on a 24px grid in currentColor. */

type Props = { className?: string }

export function InstagramIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.3" cy="6.7" r=".6" fill="currentColor" />
    </svg>
  )
}

export function LinkedInIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.5 3A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3zm2.6 3.2a1.55 1.55 0 1 1 0 3.1 1.55 1.55 0 0 1 0-3.1zM5.8 10.4h2.6v8H5.8zm4.4 0h2.5v1.1c.4-.7 1.3-1.3 2.6-1.3 2.4 0 2.9 1.6 2.9 3.6v4.6h-2.6v-4.1c0-1-.1-2.2-1.4-2.2s-1.5 1-1.5 2.1v4.2h-2.5z" />
    </svg>
  )
}

export function BehanceIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M2 6h5.6c2 0 3.4 1 3.4 2.8 0 1.1-.6 1.9-1.5 2.3 1.3.4 2 1.4 2 2.7 0 2.1-1.6 3.2-3.8 3.2H2zm2.3 1.9v2.6h2.9c.9 0 1.5-.4 1.5-1.3s-.6-1.3-1.5-1.3zm0 4.4v3h3.1c1 0 1.7-.5 1.7-1.5s-.7-1.5-1.7-1.5zM15 7h5v1.3h-5zm2.6 2.2c2.6 0 4 1.8 3.9 4.6h-6c.1 1.3.9 2 2.1 2 .8 0 1.4-.4 1.6-1h2.2c-.5 1.8-1.9 2.8-3.8 2.8-2.6 0-4.2-1.7-4.2-4.2s1.6-4.2 4.2-4.2zm-.1 1.7c-1 0-1.7.6-1.9 1.6h3.7c-.1-1-.8-1.6-1.8-1.6z" />
    </svg>
  )
}
