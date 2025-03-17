/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './layouts/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      'Poppins-ExtraLight': ['Poppins-ExtraLight'],
      'Poppins-Light': ['Poppins-Light'],
      'Poppins-Regular': ['Poppins-Regular'],
    },

    // container: {
    //   center: true,
    //   padding: '0',
    //   screens: {
    //     desktop: "1200px",
    //   },
    // },
    
    darkMode: 'class',
    extend: {
      screens: {
        '2xs': '320px',
        'xs': '400px',
        'sm': '640px',
        'md': '768px',
        'lg': '1200px',
        'xl': '1280px',
        '2xl': '1440px',
        '3xl': '1792px',
        '4xl': '2048px',
        '5xl': '2560px',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Tailwind'in global reset'ini devre dışı bırakır.normalize (reset) özellikleri devre dışı kalır ve eski SCSS stilleriniz bozulmaz.
  },
}

