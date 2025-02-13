    // const { data, pending, error } = await useFetch("/api/movies-now" , {
    //     query: { 
    //         endpoint: "movie/now_playing"
    //     }
    // });

    //<Movie> SOR!!!!!!!
//useAsyncData, veriyi sunucu tarafında hazırlar ve sayfa yüklenmeden önce çağrılmasını sağlar.
//veri bileşen yüklenmeden önce çekilir ve sayfa daha hızlı yüklenir.

import { type Movie } from "../types/types" //<Movie>

export function useNowMovies<Movie>() {
    return  useAsyncData("movies_now", () =>
        $fetch<Movie>("/api/movies-now", {
            query: { endpoint: "movie/now_playing" }
        })
    );
}
