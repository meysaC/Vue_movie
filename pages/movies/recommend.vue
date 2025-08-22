<script setup lang="ts">
import { useMovieStore } from '~/store/movie';


const description = ref('');
const movieStore = useMovieStore();

const getRecommendations = async () => {
  try {
      if(description.value.trim() === '') return;
      await movieStore.fetchRecommendedMovies(description.value);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  }
};
</script>

<template>
  <div>
    <textarea v-model="description" placeholder="Filmi tarif edin..."></textarea>
    <button @click="getRecommendations">Öneri Al</button>

    <div v-if="movieStore.recommendedMovies.length">
      <h3>Önerilen Filmler:</h3>
      <ul>
        <li v-for="movie in movieStore.recommendedMovies" :key="movie.movie_id">
          <strong>{{ movie.title }}</strong> - {{ movie.overview }}
        </li>
      </ul>
      <p><em>{{ movieStore.naturalRecommendations }}</em></p>
    </div>
  </div>
</template>


<style scoped>

</style>