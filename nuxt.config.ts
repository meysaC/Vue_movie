export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  css: ["~/assets/default.scss", "~/assets/tailwind.scss"],

  postcss: {
    plugins: {
      tailwindcss: {},
    },
  },

  runtimeConfig: {
    TMDB_API_KEY: process.env.TMDB_API_KEY, //env dosyasından oku
    public: {
      TMDB_BASE_URL: "https://api.themoviedb.org/3/",
      MoviePx_URL: "https://localhost:5188/api",
      apiBase: "https://localhost:5188/api",
    }
  },

  modules: ['@pinia/nuxt','@nuxt/icon'],
  ssr: false, 
})
