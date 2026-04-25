import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'sans-serif'] },
      colors: {
        fifa: {
          blue: '#1565c0',
          dark: '#0d47a1',
          light: '#1e88e5',
          navy: '#0a1f5c',
          gold: '#f9a825',
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0a1f5c 0%, #1565c0 50%, #0d47a1 100%)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
