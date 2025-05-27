// import fs from 'node:fs' //fs (Node.js'in file system modülü) tarayıcı ortamında değil, yalnızca Node.js ortamında çalışır. Nuxt 3'ün nuxt.config.ts dosyası runtime değil build-time çalıştığı için Node.js modüllerini direkt kullanabilirsiniz ama önce doğru şekilde import etmelisiniz.
// import path from 'node:path'
const fs = require('fs') //Eğer nuxt.config.ts yerine nuxt.config.js kullanırsan fs'i gönül rahatlığıyla çağırabilirsin. Çünkü bu sefer config Node.js ortamında doğrudan çalışır:
const path = require('path')

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  devServer: {
    https: {
      // key: 'ssl/localhost-key.pem', 
      // cert: 'ssl/localhost-cert.pem'

      // key: fs.readFileSync(path.resolve(__dirname, 'ssl/localhost-key.pem'), 'utf8'),  // sertifika dosyalarını fs.readFileSync() ile okuyorsun ama bu fonksiyon Buffer döndürür. Fakat Nuxt'un devServer.https konfigürasyonu string bekliyor (yani dosya içeriğini doğrudan değil, dosya yolunu vermeni istiyor)
      // cert: fs.readFileSync(path.resolve(__dirname, 'ssl/localhost-cert.pem'), 'utf8') //YANİ 'utf8'  ile string dönüşü garanti edilir ve s.startsWith hatası engellenmiş olur.

      key: fs.readFileSync(path.resolve(__dirname, 'ssl/localhost-key.pem'), 'utf8'),
      cert: fs.readFileSync(path.resolve(__dirname, 'ssl/localhost.pem'), 'utf8')
    }
  },

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
