import { useAxios } from "~/composable/useAxios";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const endpoint = "movie/now_playing"; // query.endpoint?.toString() || 

    const api = useAxios();

    try {
      const response = await api.get(endpoint, {
        params: {
          api_key: useRuntimeConfig().TMDB_API_KEY, // API KEY buraya ekleniyor
          language: "en-US",
          page: 1,
        },
      });

      return response.data;
    } catch (error) {
      console.error("TMDB API Error:", error);
      throw createError({ statusCode: 500, statusMessage: "API Error" });
    }
});
 