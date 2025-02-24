import { useAxios } from "~/composable/useAxios";

export default defineEventHandler(async(event) => {
    const query = getQuery(event);
    const movieId = query.movieId;

    const api = useAxios();
    try {
        const response = await api.get(`/movie/${movieId}`, {
            params: {
                api_key: useRuntimeConfig().TMDB_API_KEY, 
                append_to_response: "videos",
            },
          });
        return response.data;            
    } catch (error) {
        console.error("TMDB API Error:", error);
        throw createError({ statusCode: 500, statusMessage: "API Error" });
    }

})