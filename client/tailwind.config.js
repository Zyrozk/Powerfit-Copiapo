/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. Definimos los "fotogramas" de la animación
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateY(100%)', opacity: '0' }, // Empieza abajo e invisible
          '100%': { transform: 'translateY(0)', opacity: '1' },  // Termina en su sitio y visible
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        }
      },
      // 2. Creamos las clases de utilidad para usar en el HTML
      animation: {
        'slide-in': 'slide-in 0.5s ease-out forwards', // Clase: animate-slide-in
        'fade-out': 'fade-out 0.5s ease-out forwards', // Clase: animate-fade-out
      }
    },
  },
  plugins: [],
}