import { type Result } from "../types/types"

//<Result>
export function useTrailerMovie<Result>(movieId: number) {
    return useAsyncData("trailer_movie", async () => {
        try {
            const data = await $fetch<Result>("/api/movie-trailer", {
                query: {
                    movieId: movieId, 
                },
            });
            console.log("useTrailerMovie data:", data);
            return data;
        } catch (error) {
            console.error("useTrailerMovie Hatası:", error);
            return null;
        }
    });
}