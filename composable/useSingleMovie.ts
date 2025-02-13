import { type Movie } from "../types/types" //<Movie>

//[id].vue dan gelen id yi yolla!!!
export function useSingleMovie<Movie>(id: string){
    return useAsyncData("movie_single", () => 
    $fetch<Movie>("/api/movie-single", {
        query: {
            id: id, 
        }
    }),
    );
}