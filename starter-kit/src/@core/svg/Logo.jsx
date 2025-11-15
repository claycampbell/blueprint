const Logo = props => {
  return (
    <svg width='40' height='40' viewBox='0 0 40 40' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
      {/* Outer square frame representing blueprint/plans */}
      <rect
        x='4'
        y='4'
        width='32'
        height='32'
        rx='2'
        stroke='var(--mui-palette-primary-main)'
        strokeWidth='2'
        fill='none'
      />

      {/* Inner grid representing blueprint grid lines */}
      <line x1='20' y1='8' x2='20' y2='32' stroke='var(--mui-palette-primary-main)' strokeWidth='1' opacity='0.4' />
      <line x1='8' y1='20' x2='32' y2='20' stroke='var(--mui-palette-primary-main)' strokeWidth='1' opacity='0.4' />

      {/* Building/house icon in center */}
      <path
        d='M20 12 L28 18 L28 28 L12 28 L12 18 Z'
        fill='var(--mui-palette-primary-main)'
        opacity='0.8'
      />

      {/* Roof highlight */}
      <path
        d='M20 12 L28 18 L12 18 Z'
        fill='var(--mui-palette-primary-main)'
      />

      {/* Door */}
      <rect
        x='18'
        y='23'
        width='4'
        height='5'
        fill='var(--mui-palette-background-default)'
        rx='0.5'
      />

      {/* Windows */}
      <rect
        x='14'
        y='20'
        width='3'
        height='3'
        fill='var(--mui-palette-background-default)'
        rx='0.5'
      />
      <rect
        x='23'
        y='20'
        width='3'
        height='3'
        fill='var(--mui-palette-background-default)'
        rx='0.5'
      />
    </svg>
  )
}

export default Logo
