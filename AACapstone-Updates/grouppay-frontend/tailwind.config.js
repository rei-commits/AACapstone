/** @type {import('tailwindcss').Config} */
module.exports = {
  // Enable dark mode using class strategy
  darkMode: 'class',
  
  // Define content sources for Tailwind to process
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  
  theme: {
    extend: {
      // Custom colors
      colors: {
        'background-light': '#F8FAFC',
        'background-dark': '#0F172A',
      },
      
      // Custom animation keyframes
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' }
        }
      },
      
      // Custom animation definitions
      animation: {
        shimmer: 'shimmer 1.5s infinite'
      }
    },
  },
  
  // Plugin configurations
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 