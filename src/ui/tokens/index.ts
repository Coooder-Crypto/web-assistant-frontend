export * from './animations'
export * from './colors'
export * from './spacing'
export * from './typography'

// Design system theme
export const theme = {
  // Breakpoints for responsive design
  breakpoints: {
    'xs': '0px',
    'sm': '576px',
    'md': '768px',
    'lg': '992px',
    'xl': '1200px',
    '2xl': '1400px',
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
    toast: 1080,
  },
} as const
