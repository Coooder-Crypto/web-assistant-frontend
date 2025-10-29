export const colors = {
  // Modern dark theme colors
  primary: {
    50: '#f4f1ff',
    100: '#ede8ff',
    200: '#dcd4ff',
    300: '#c5b3ff',
    400: '#a88eff',
    500: '#8b5cf6', // Purple accent
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
  },

  // Dark grayscale palette
  neutral: {
    0: '#ffffff',
    100: '#e6e6e6',
    200: '#a5a5b3',
    300: '#9898a6',
    400: '#8d8d99',
    500: '#757580',
    600: '#5e5e66',
    700: '#46464d',
    800: '#303038',
    850: '#26262b', // Main background
    900: '#16161a',
    950: '#010101',
  },

  // Semantic colors
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#f54a45',
    info: '#3b82f6',

    // AI-specific states
    thinking: '#8b5cf6',
    processing: '#06b6d4',
    completed: '#10b981',
  },

  // AI interface colors
  ai: {
    gradient: {
      start: '#6a54f4',
      end: '#5644c9',
    },
    message: {
      user: '#303038', // Dark user message bg
      assistant: '#26262b', // Main bg for assistant
      system: '#46464d', // System message bg
    },
    accent: {
      glow: 'rgba(106, 84, 244, 0.2)', // Purple glow
      border: 'rgba(106, 84, 244, 0.3)', // Purple border
    },
    processing: '#ffd84f', // Processing indicator yellow
  },

  // Extended purple palette
  purple: {
    100: '#a699ff',
    200: '#9080ff',
    300: '#8573ff',
    400: '#7461f2',
    500: '#5342be',
    600: '#5647b2',
    700: '#493d99',
    800: '#312966',
    900: '#39364d',
  },

  violet: {
    400: '#db73ff',
    500: '#b241d9',
    600: '#9a30bf',
    700: '#732a8c',
  },
} as const

export type ColorToken = keyof typeof colors
