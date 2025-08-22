import { defineStore } from "pinia";
import type { Movie } from "~/types/types";

interface RecommendMovie {
    movie_id: number;
    title: string;
    overview: string;
}

export const useMovieStore = defineStore("movie", {
  state: () => ({
    movieDetails: [] as Movie[],
    recommendedMovies: [] as RecommendMovie[],
    naturalRecommendation: "",
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchRecommendedMovies(description: string) {
        const { $myAxios } = useNuxtApp();
        try {
          const response = await $myAxios.post("/movies/recommendations", { 
              description 
          });
          this.recommendedMovies = response.data.recommendMovies;
          this.naturalRecommendation = response.data.naturalRecommendation;

        } catch (error) {
          
        }
    },
    async fetchMovieById(movieId: number) {
        const { $myAxios } = useNuxtApp();
        try {
            this.loading = true;
            const response = await $myAxios.get(`/movies/${movieId}`);
            //this.movieDetails = response.data;
            return response.data as Movie;
        } catch (error) {
            this.error = "Error fetching movie details";
            console.error("Error fetching movie details:", error);
        } finally {
            this.loading = false;
        }
    }
}
});