import { useAxios } from "~/composable/useAxios";

//HTTP isteklerini (GET, POST, PUT, DELETE) dinler ve yanıt döndürür.

//Nuxt 3’ün API Routes özelliğini kullanıyor. Eğer useSearchMovie.ts içinde direkt olarak https://api.. şeklinde çağrı olsaydı api key istemci tarafında görülebilirdi. 
// burada api çağrısını server side (sunucu tarafında) api key gizli kalıyor.
export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const endpoint = "search/movie"; // query.endpoint?.toString() ||
    const searchQuery = query.search?.toString() || ""; // Arama metni alınıyor

    const api = useAxios();

    try {
      const response = await api.get(endpoint, {
        params: {
          api_key: useRuntimeConfig().TMDB_API_KEY, // API KEY buraya ekleniyor
          language: "en-US",
          page: 1,
          query: searchQuery,
        },
      });

      return response.data;
    } catch (error) {
      console.error("TMDB API Error:", error);
      throw createError({ statusCode: 500, statusMessage: "API Error" });
    }
});
