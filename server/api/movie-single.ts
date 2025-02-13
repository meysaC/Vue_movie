import { useAxios } from "~/composable/useAxios";

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const id = query.id;
    const endpoint = `movie/${id}`   ; //query.endpoint?.toLocaleString.toString(); 
    //const se

    const api = useAxios();
    try {
        const response = await api.get(endpoint, {
            params: {
                api_key: useRuntimeConfig().TMDB_API_KEY,
                language: "en-US",
            },
        });

        return response.data;
    } catch (error) {
        console.error("TMDB API Error:", error);
        throw createError({ statusCode: 500, statusMessage: "API Error" });
    }
});