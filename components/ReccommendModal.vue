<script setup lang="ts">
import { useMovieStore } from '~/store/movie';
import { useTrailerMovie } from '~/composable/useTrailerMovie';
import Youtube from 'vue3-youtube';
import { type Movie } from '~/types/types';

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close'])
const close = () => { emit('close') }
const activeTab = ref<Record<number, 'poster' | 'trailer'>>({})//ref('poster');
const showForm = ref<boolean>(true);

const description = ref('');
const movieStore = useMovieStore();
const trailer = ref<Record<number, any>>({});//<{ key: string; name: string } | null>(null); //

const normalizeMovie = (apiMovie: any): Movie => ({
  id: apiMovie.id,
  title: apiMovie.title,
  original_title: apiMovie.originalTitle,
  original_language: apiMovie.originalLanguage,
  overview: apiMovie.overview,
  release_date: apiMovie.releaseDate,
  poster_path: apiMovie.posterPath,
  backdrop_path: apiMovie.backdropPath ?? "",
  popularity: apiMovie.popularity,
  vote_average: apiMovie.voteAverage,
  vote_count: apiMovie.voteCount,
  adult: apiMovie.adult,
  video: apiMovie.video,
  genre_ids: apiMovie.genres?.map((g: any) => g.id) ?? []
});

const staticRecommendations = ref([
  { movie_id: 1307078, title: "My Oxford Year" },
  { movie_id: 950387, title: "A Minecraft Movie" },
  { movie_id: 1078896, title: "The Amateur" },
  { movie_id: 611215, title: "Jokōsei torio: seikan shiken" },
  { movie_id: 1010581, title: "My Fault" },
  { movie_id: 947478, title: "The Green Dinosaur" },
  { movie_id: 947478, title: "The Green Dinosaur" },
  { movie_id: 460292, title: "Kiss and Kill" },
  { movie_id: 460292, title: "Kiss and Kill" },
  { movie_id: 1393382, title: "Popeye's Revenge" },
  { movie_id: 1393382, title: "Popeye's Revenge" },
  { movie_id: 1136867, title: "Materialists" }
])

const getRecommendations = async () => {
  try {
    // if(description.value.trim() === '') return;
    // await movieStore.fetchRecommendedMovies(description.value);

    // if (!movieStore.recommendedMovies || !movieStore.recommendedMovies.length) return;
    
    const details = await Promise.all(
    staticRecommendations.value.map(m => movieStore.fetchMovieById(m.movie_id))); // movieStore.recommendedMovies

    movieStore.movieDetails = details.filter(Boolean).map(normalizeMovie);
    
    movieStore.movieDetails.forEach(movie => {
      activeTab.value[movie.id] = 'poster';
    });

    description.value = '';
    showForm.value = false;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  }
};


const loadTrailer = async (movieId: number) => {
  const { data: useTrailer } = await useTrailerMovie(movieId);
  if (useTrailer.value?.videos?.results?.length) {
    trailer.value[movieId] = await useTrailer.value.videos.results.find((vid: { name: string }) => vid.name === "Official Trailer") 
        || useTrailer.value.videos.results[0];
  }
  else {
    trailer.value[movieId] = null;
  }
};
</script>

<template>
  <div v-if="show" @click.self="close" class="fixed flex items-center justify-center bg-black bg-opacity-50 inset-0 z-50 ">
    <div class="relative w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] max-w-[1000px] p-4 sm:p-6 bg-[#111827] rounded-lg shadow-lg my-8"> <!--w-full max-w-[1000px] p-6 -->
      <button  @click="close" class="button absolute -top-4 -right-4 ">✕</button>

      <div v-if="showForm" class="mb-4">
        <textarea v-model="description" placeholder="Descripe what type of movie you like to watch..." class="w-full p-2 border rounded"></textarea>
        <button @click="getRecommendations" class="button mt-2 px-4 py-2 rounded">Get Recommendations</button>
      </div>

      <div v-else class="flex flex-col">
        <div class="overflow-y-auto max-h-[550px] sm:max-h-[750px]">
          
          <div class="sticky bg-[#111827] z-10 top-0 pb-4 text-white">
            <h3 >Recommendations:</h3>
          </div>
          
          <div class="text-white ">
            <p><em>{{ movieStore.naturalRecommendation }}
              xdcfvgbhnjmklfksbdvghbrjebvsrbv hj nvjerkvnge jergknwrgl fnjkreljnre newkgşnrwjkng
              xdcfvgbhnjmklfksbdvghbrjebvsrbv hj nvjerkvnge jergknwrgl fnjkreljnre newkgşnrwjkng
              xdcfvgbhnjmklfksbdvghbrjebvsrbv hj nvjerkvnge jergknwrgl fnjkreljnre newkgşnrwjkng
              xdcfvgbhnjmklfksbdvghbrjebvsrbv hj nvjerkvnge jergknwrgl fnjkreljnre newkgşnrwjkng
              xdcfvgbhnjmklfksbdvghbrjebvsrbv hj nvjerkvnge jergknwrgl fnjkreljnre newkgşnrwjkng
            </em></p>
          </div>
  
          <div v-if="movieStore.movieDetails.length"  class="grid grid-cols-1 sm:grid-cols-2 mt-8 gap-4"> <!--sm:grid-cols-2 max-h-[200px] sm:max-h-[750px] overflow-y-auto py-20 -->
            <div v-for="movieRecommend in movieStore.movieDetails" :key="movieRecommend.id" class="mb-2">
              <div class="tabs">
                <button @click="activeTab[movieRecommend.id] = 'poster'" :class="{ active: activeTab[movieRecommend.id] === 'poster' }">Afiş</button>
                <button @click="() => {
                    activeTab[movieRecommend.id] = 'trailer'; 
                    if(!trailer[movieRecommend.id]) loadTrailer(movieRecommend.id);
                }" :class="{active: activeTab[movieRecommend.id] === 'trailer'}" class="pr-4">Trailer</button>
              </div>
              
              <!-- Movie Details -->
              <div v-if="activeTab[movieRecommend.id] == 'poster'">
                <MovieCard :movie="movieRecommend" class="w-[400px] h-auto"/>
              </div>
          
              <!-- Movie Trailer -->
              <div v-else-if="activeTab[movieRecommend.id] === 'trailer'" class=" relative w-full">
                <div v-if="trailer[movieRecommend.id]" class="relative pb-[56.25%] h-0 overflow-hidden rounded">
                  <Youtube  
                    :src="`https://www.youtube.com/watch?v=${trailer[movieRecommend.id].key}`" 
                    :video-id="trailer[movieRecommend.id].key" 
                    class="absolute top-0 left-0 w-full h-full"/>
                    
                    <div class="text-black pt-20"><p><em>{{ movieRecommend.overview }}sdxfcgvbhnjkmlöşç vgbhjnkmlö fghıjlokşpl xfcghvjbknlm</em></p></div>
                </div>
                
                <div v-else>We didn't find the trailer.</div>
              </div>  
    
            </div >
          </div>
        </div>
        <button @click="showForm = true" class="button bottom-4 right-4 mt-4 px-6 py-3">Try Again</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    
    button {
      padding: 10px 20px;
      border: none;
      background: #444;
      color: white;
      cursor: pointer;
      border-radius: 5px;
      transition: background 0.3s;
      
      &.active {
         background: #ffc928e6; /*#ff4500 */
      }
      &:hover {
        background: #916d01; 
      }
    }
  }

</style>