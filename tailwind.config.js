/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      minHeight: {
        'screen-sm': '500px',
        'screen-md': '600px',
        'screen-lg': '700px'
      },
      maxWidth: {
        'popup': '400px'
      },
      width: {
        'popup': '400px'
      },
      spacing: {
        'popup-padding': '1rem'
      },
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
          light: '#60A5FA',
          dark: '#1D4ED8'
        },
        background: {
          DEFAULT: '#FFFFFF',
          dark: '#1F2937'
        },
        text: {
          DEFAULT: '#111827',
          secondary: '#4B5563',
          dark: '#F9FAFB',
          'dark-secondary': '#D1D5DB'
        },
        border: {
          DEFAULT: '#E5E7EB',
          dark: '#374151'
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#333',
            a: {
              color: '#3182ce',
              '&:hover': {
                color: '#2c5282',
              },
            },
            code: {
              color: '#333',
              backgroundColor: '#f5f5f5',
              padding: '0.2em 0.4em',
              borderRadius: '3px',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              color: '#333',
              backgroundColor: '#f5f5f5',
              padding: '1em',
              borderRadius: '0.375rem',
              overflow: 'auto',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
