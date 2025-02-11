// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  css: ["~/assets/default.scss"],

  runtimeConfig: {
    TMDB_API_KEY: process.env.TMDB_API_KEY, //env dosyasından oku
    public: {
      TMDB_BASE_URL: "https://api.themoviedb.org/3/",
    }
  },

  devtools: { enabled: true },
  ssr: false, //bu olmadığında hata veriyo
})
