import { type Movie } from "../types/types" //<Movie>

//Arama sonuçlarını tutacak reactive state 
//Ref<string> Vue 3'ün ref API'sinden gelir ve reaktif (reactive) bir değişkeni temsil eder. 
export function useSearchMovie<Movie>(searchInput: Ref<string>) {
   //$fetch<Movie>("/api/movie-search", ... ile  server/api/movie-search.ts dosyasına istek atılıyor -> gelen veriler response.data olarak döndürülüyor -> searchResults(index.vue) değişkenine bu veriler atanıyor ve sonuçlar sayfada gösteriliyor 
    return useAsyncData("searched_movies", () =>
        $fetch<Movie>("/api/movie-search", {
            query: {
                endpoint: "search/movie",
                search: searchInput.value,
            }
        }),
        { watch: [searchInput] } // Watch reactive sources to auto-refresh when changed searchInput değiştikçe API çağrısı yapar
    );
}