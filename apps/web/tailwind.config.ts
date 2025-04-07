import { withTV } from 'tailwind-variants/dist/transformer.js';
import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      fontSize: {
        xxs: '0.625rem',
        sm: ['14px', '20px'],
        base: ['16px', '20px'],
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
      },
      flex: {
        full: '0 0 100%',
      },
      maxWidth: {
        dashboard: 'var(--dashboard-container)',
      },
      width: {
        sidebar: 'var(--w-sidebar)',
      },
      height: {
        header: 'var(--header-h)',
      },
      zIndex: {},
      borderWidth: {
        DEFAULT: '1.5px',
        '0': '0',
        '1': '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
        '6': '6px',
        '8': '8px',
      },
      colors: {
        border: {
          DEFAULT: 'hsl(var(--border))',
        },
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: {
          DEFAULT: 'hsl(var(--background))',
          2: 'hsl(var(--background2))',
        },
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          light: 'hsl(var(--success-light))',
        },
        error: {
          DEFAULT: 'hsl(var(--error))',
          light: 'hsl(var(--error-light))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          light: 'hsl(var(--warning-light))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          light: 'hsl(var(--info-light))',
        },
        divider: 'hsl(var(--divider))',
        'navigate-tab': 'hsl(var(--navigate-tab))',
        'gray-color': 'hsl(var(--gray-color))',
        neutral: {
          '0': '#FFFFFF',
          '10': '#DADADA',
          '20': '#B5B5B5',
          '30': '#909090',
          '40': '#6B6B6B',
          '50': '#464646',
          '60': '#212121',
        },
        main: {
          DEFAULT: '#133C65',
          '0': '#ECF0F4',
          '10': '#DBE4ED',
          '20': '#DBE4ED',
          '30': '#B4D2F0',
          '40': '#6391C0',
          '50': '#133C65',
          '60': '#0B233A',
        },
        readonly: {
          DEFAULT: '#E6E6E6',
          border: '#B6B6B6',
        },
      },
      borderRadius: {
        '3xl': '36px',
        '2xl': '24px',
        xl: '16px',
        lg: '12px',
        md: '8px',
        sm: '4px',
        haft: '50%',
      },
      boxShadow: {
        inset: 'inset 0 12px 18px #ffffff4d',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      backgroundImage: {
        'header-texture': "url('/bg-header-texture.png')",
        'main-layout': 'radial-gradient(58.42% 87.74% at 47.06% 12.26%, rgba(246, 118, 38, 0.3) 0%, #000000 100%)',
        'card-border': 'linear-gradient(328deg,#fff,#fff0 37%),linear-gradient(163deg,#fff,#fff0 27%)',
        'main-image': "url('/bg-main-coming-soon.jpg')",
        'main-gradient-image': "url('/bg-main-gradient-center.svg')",
        'gradient-dark-1':
          'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.11248249299719892) 15%, rgba(1,1,0,0.2413340336134454) 30%, rgba(5,4,0,0.35057773109243695) 45%, rgba(0,0,0,0.5466561624649859) 60%, rgba(0,0,0,0.7679446778711485) 75%, rgba(0,0,0,1) 100%)',
      },
    },
  },
  darkMode: 'class',
  plugins: [require('tailwindcss-animate'), require('tailwindcss-gradient-border')],
};

export default withTV(config);
