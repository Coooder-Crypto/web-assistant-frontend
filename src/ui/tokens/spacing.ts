export const spacing = {
  // Consistent spacing scale
  0: '0',
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
} as const

export const radius = {
  'none': '0',
  'sm': '0.125rem', // 2px
  'base': '0.25rem', // 4px
  'md': '0.375rem', // 6px
  'lg': '0.5rem', // 8px
  'xl': '0.75rem', // 12px
  '2xl': '1rem', // 16px
  '3xl': '1.5rem', // 24px
  'full': '9999px',
} as const

export const shadows = {
  'none': 'none',
  'sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'base': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  'md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  'lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  'xl': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',

  // Special AI-themed shadows
  'glow': '0 0 20px 0 rgb(99 102 241 / 0.15)',
  'glowLg': '0 0 40px 0 rgb(99 102 241 / 0.2)',
} as const

export type SpacingToken = keyof typeof spacing
export type RadiusToken = keyof typeof radius
export type ShadowToken = keyof typeof shadows
