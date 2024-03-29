// tailwind.config.js
const plugin = require('tailwindcss/plugin')
const colors = require('tailwindcss/colors')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{css,xml,html,vue,svelte,ts,tsx}'],
  // use the .ns-dark class to control dark mode (applied by NativeScript) - since 'media' (default) is not supported.
  darkMode: ['class', '.ns-dark'],
  theme: {
    extend: {
      fontFamily: {
        'sf-pro': ["SF Pro", "SF-Pro"],
        'dm-sans': "DM Sans",
        'roboto': "Roboto"
      }
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.25rem',
      xl: '1.5rem',
      '2xl': '1.75rem',
      '3xl': '2rem',
      '4xl': '2.5rem',
      '5xl': '3rem',
      'heading-xl': ['2rem', {
        lineHeight: '1.313rem',
        // letterSpacing: '-0.04em',
      }],
      'heading-lg': ['1.75rem', {
        lineHeight: '1.286rem',
        // letterSpacing: '-0.035em',
      }],
      'heading-md': ['1.5rem', {
        lineHeight: '0.38rem',
        // letterSpacing: '0.022em',
      }],
      'heading-sm': ['1.15rem', {
        lineHeight: '1.3rem',
        // letterSpacing: '-.075em',
      }],
      'subheading-md': ['1rem', {
        lineHeight: '1.3rem',
        // letterSpacing: '-.075em',
      }],
      'body-lg': ['1.125rem', {
        lineHeight: '1.5rem',
        // letterSpacing: '0rem',
      }],
      'body-md': ['1rem', {
        lineHeight: '1.5rem',
        // letterSpacing: '0rem',
      }],
      'body-sm': ['0.875rem', {
        lineHeight: '1.5rem',
        // letterSpacing: '0rem',
      }],
      'label-md': ['0.875rem', {
        lineHeight: '1.5rem',
        // letterSpacing: '0.018rem',
      }],
      'label-sm': ['0.75rem', {
        lineHeight: '1.5rem',
        // letterSpacing: '0.015rem',
      }],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#FFF',
      black: '#000',
      red: colors.red,
      slate: colors.slate,
      gray: colors.gray,
      emerald: colors.emerald,
      blue: colors.blue,
      yellow: colors.yellow,
      // TEXT
      t: {
        light: {
          primary: '#111827', // gray-900
          secondary: '#6B7280', // gray-500
          tertiary: '#e2e8f0', // gray-200
          invert: '#F3F4F6', // gray-100
          brand: '#FCD34D' // yellow-300
        },
        dark: {
          primary: '#F3F4F6', // gray-100
          secondary: '#E5E7EB', // gray-200
          invert: '#111827', // gray-900
          brand: '#FCD34D' // yellow-300
        }
      },
      // SURFACE
      s: {
        light: {
          primary: '#F3F4F6', // gray-100
          secondary: '#374151', // gray-700
          invert: '#111827', // gray-900
          brand: '#FCD34D', // yellow-300
          'brand-light': '#FFFBEB', // yellow-50
        },
        dark: {
          primary: '#111827', // gray-900
          secondary: '#D1D5DB', // gray-300
          invert: '#F3F4F6', // gray-100
          brand: '#FCD34D', // yellow-300
          'brand-light': '#FFFBEB', // yellow-50
        }
      },
      // BORDER
      b: {
        DEFAULT: '#F3F4F6', // gray-100
      }
    },
    spacing: {
      // customize 
    },
    borderRadius: {
      // 'none': '0',
      // 'sm': '.125rem',
      // DEFAULT: '.25rem',
      // 'lg': '.5rem',
      // 'full': '9999px',
    }
  },
  plugins: [
    /**
     * A simple inline plugin that adds the ios: and android: variants
     *
     * Example usage:
     *
     *   <Label class="android:text-red-500 ios:text-blue-500" />
     *
     */
    plugin(function ({ addVariant }) {
      addVariant('android', '.ns-android &')
      addVariant('ios', '.ns-ios &')
    }),
  ],
  corePlugins: {
    preflight: false, // disables browser-specific resets
  },
}
