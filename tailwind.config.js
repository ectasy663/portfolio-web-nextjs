/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFFDF0',
          100: '#FFFAC2',
          200: '#FFF294',
          300: '#FFE666',
          400: '#FFD700',
          500: '#D4AF37',
          600: '#AA8C2C',
          700: '#806921',
          800: '#554616',
          900: '#2B230B',
        },
        secondary: {
          400: '#4ADE80',
          500: '#10B981',
          600: '#059669',
        },
        dark: {
          800: '#454545',
          900: '#0a0a0a',
          950: '#050505',
        },
      },
      fontFamily: {
        'sans': ['The Seasons', 'var(--font-poppins)', 'system-ui', 'sans-serif'],
        'display': ['The Seasons', 'var(--font-outfit)', 'system-ui', 'sans-serif'],
        'heading': ['The Seasons', 'var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
        'body': ['The Seasons', 'var(--font-poppins)', 'system-ui', 'sans-serif'],
        'mono': ['var(--font-jetbrains-mono)', 'Fira Code', 'Monaco', 'Consolas', 'monospace'],
        'seasons': ['The Seasons', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #D4AF37 0%, #AA8C2C 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'royal-gold': '0 4px 14px 0 rgba(212, 175, 55, 0.2)',
      },
      animation: {
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 20s linear infinite',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backdropBlur: {
        'xs': '2px',
      },
      perspective: {
        '1000': '1000px',
        '1500': '1500px',
        '2000': '2000px',
      },
      screens: {
        'xs': '375px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
