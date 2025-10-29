export const animations = {
  // Transition durations
  duration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
    slower: '500ms',
  },

  // Easing functions for natural feel
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',

    // AI-specific smooth transitions
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Keyframe animations
  keyframes: {
    // Thinking indicator
    pulse: `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `,

    // Loading spinner
    spin: `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `,

    // Fade in/out
    fadeIn: `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `,

    fadeOut: `
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(-10px); }
      }
    `,

    // Slide animations
    slideUp: `
      @keyframes slideUp {
        from { transform: translateY(100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `,

    slideDown: `
      @keyframes slideDown {
        from { transform: translateY(-100%); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
    `,

    // AI-specific typing animation
    typing: `
      @keyframes typing {
        0%, 20% { transform: scale(1); }
        50% { transform: scale(1.2); }
        80%, 100% { transform: scale(1); }
      }
    `,

    // Glow effect for AI elements
    glow: `
      @keyframes glow {
        0%, 100% { box-shadow: 0 0 20px 0 rgb(99 102 241 / 0.1); }
        50% { box-shadow: 0 0 40px 0 rgb(99 102 241 / 0.2); }
      }
    `,
  },

  // Common animation combinations
  presets: {
    fadeIn: 'fadeIn 250ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
    fadeOut: 'fadeOut 200ms cubic-bezier(0.4, 0, 1, 1) forwards',
    slideUp: 'slideUp 300ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
    slideDown: 'slideDown 300ms cubic-bezier(0.25, 0.1, 0.25, 1) forwards',
    pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    spin: 'spin 1s linear infinite',
    typing: 'typing 1.4s ease-in-out infinite',
    glow: 'glow 3s ease-in-out infinite',
  },
} as const

export type AnimationToken = keyof typeof animations
