<script setup lang="ts"> // LANG TS dosyanın içeriğini TypeScript olarak işler. Bu da:Tip kontrolü (örneğin Movie[], string, null vs.) sağlar
import MovieCard from '~/components/MovieCard.vue'
import { useUserStore } from '~/store/user';
import type { Movie } from '~/types/types'

const props = defineProps({
  userId: String
});
const userStore = useUserStore();
const data = ref<Movie[]>([]);

onMounted(async () => {
  try {
    const result = await userStore.fetchFavoriteMovies(props.userId);
    //backend den gelen veri tipi ile tamamen uyumlu olmadığı için mapper kullanıyoruz.
    // (backend den sadece gerekli alanları gönderiyoruz ama frontend de örneğin MovieCard tüm Movie verilerini props olarak kullanıyor)
    if(result && Array.isArray(result)){
      // data.value = result.data.map((item: any) => {
      //   const movie = item.movie;
      //   return {
      //     id: movie.id,
      //     title: movie.title,
      //     poster_path: movie.posterPath,
      //     release_date: movie.releaseDate,
      //     overview: movie.overview,
      //     // vote_average: parseFloat(movie.voteAverage.replace(",", ".")), //movie.voteAverage virgül varsa düzelt
      //     vote_average: parseFloat((movie.voteAverage || "0").toString().replace(",", ".")),

      //     //eksik alanlar default olarak dolduruluyor
      //     adult: false,
      //     backdrop_path: "",
      //     genre_ids: [],
      //     original_language: "en",
      //     original_title: movie.title,
      //     popularity: 0,
      //     video: false,
      //     vote_count: 0
      //   } as Movie;
      // })

      data.value = result.map(item => item.movie);
    } 
  } catch (error) {
    console.error("Error fetching favorite movies in favorites tab:", error);
  }
});

</script>

<template>
  <div>
    <div v-if="data.length === 0">
      Bu kullanıcı favori film eklememiş. {{ data.length }}
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <MovieCard
        v-for="movie in data"
        :key="movie.id"
        :movie="movie" />
    </div>
  </div>
</template>