<script setup lang="ts">
import MovieCard from '~/components/MovieCard.vue'
import { useUserStore } from '~/store/user'
import type { Movie } from '~/types/types'

const props = defineProps({
  userId: String
});
const userStore = useUserStore();
const data = ref<Movie[]>([])

onMounted(async () => {
  try {
    const result = await userStore.fetchWatchedMovies(props.userId);
    if(result) {
      data.value = result.map(item => item.movie)
    }
  } catch (error) {
    console.error("Error fetching watched movies in watched tab:", error);
  }
})
</script>

<template>
  <div>
    <div v-if="data.length === 0">
      Bu kullanıcı hiç film izlememiş!!.
    </div>
    <div v-else class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <MovieCard
        v-for="movie in data"
        :key="movie.id"
        :movie="movie" />
    </div>
  </div>
</template>