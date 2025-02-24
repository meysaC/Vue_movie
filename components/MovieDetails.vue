<script setup lang="ts">
import { type Movie } from '~/types/types';
import Youtube from 'vue3-youtube';
import { useTrailerMovie } from '~/composable/useTrailerMovie';

const props = defineProps<({
    movie: {
        id: number;
        title: string;
        poster_path: string;
        tagline: string;
        release_date: string;
        runtime: number;
        revenue: number;
        overview: string;
  };
})>();

const trailer = await ref<{ key: string; name: string } | null>(null);
const play = ref(false);
const activeTab = ref('poster');

const {data: useTrailer} = await useTrailerMovie(props.movie.id);
if (useTrailer.value.videos && useTrailer.value.videos.results.length) {
  trailer.value = await useTrailer.value.videos.results.find( (vid: { name: string}) => vid.name === "Official Trailer") || useTrailer.value.videos.results[0];
}

// const fetchTrailer = async()=> {
//   try{
//     const response = await fetch(`https://api.themoviedb.org/3/movie/${props.movie.id}?api_key=100267ca4cf87b2a6b6ecf8ad03153bd&append_to_response=videos`)
//     const data = await response.json();
//     if (data.videos && data.videos.results.length) {
//       trailer.value = data.videos.results.find( (vid: { name: string}) => vid.name === "Official Trailer") || data.videos.results[0];
//     }
//     //console.log(trailer.value);
//   }catch (error) {
//     console.error('Error fetching trailer:', error);
//   }
// }
// onMounted(() => {
//   fetchTrailer();
// });
</script>

<template>
    <div class="container single-movie">
        <NuxtLink class="button" :to="{ name: 'index'}">Back</NuxtLink>
        <div class="tabs">
            <button @click="activeTab = 'poster'" :class="{ active: activeTab === 'poster' }">Poster</button>
            <button @click="activeTab = 'trailer'" :class="{ active: activeTab === 'trailer' }">Trailer</button>
        </div>        
        
        <div class="movie-info">
            
          <!--Movie Poster-->
            <div v-if="activeTab === 'poster' " class="movie-img">
              <img :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`" alt="">
            </div>

            <!--Movie Trailer-->
            <div v-else="activeTab === 'trailer' " class="tariler-container flex flex-col mt-10">
                <Youtube v-if="trailer" 
                  :src="`https://www.youtube.com/watch?v=${trailer.key}`" 
                  :video-id="trailer.key" 
                  :width="800" 
                  :height="450" 
                  class="w-full h-[450px]" />
                <div v-else>Trailer not Found.</div>
            </div>       
            
            <!--Movie Content-->
            <div class="movie-content">
                    <h1>Title: {{ movie.title }}</h1>
                    <p class="movie-fact tagline">
                        <span>Tagline:</span>"{{ movie.tagline }}"
                    </p>
                    <p class="movie-fact">
                        <span></span>Realesed:
                            {{ 
                                new Date(movie.release_date).toLocaleString('en-us', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                }) 
                            }}
                    </p>
                    <p class="movie-fact">
                        <span>Duration:</span> {{ movie.runtime }} minutes
                    </p>
                    <p class="movie-fact">
                        <span>Revenue:</span>
                        {{
                            movie.revenue.toLocaleString('en-us', {
                            style: 'currency',
                            currency: 'USD',
                            })
                        }}
                    </p>
                    <p class="movie-fact"><span>Overview:</span> {{ movie.overview }}</p>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.single-movie {
  overflow-x: hidden;
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px 16px;

  .button {
    align-self: flex-start; //doesnt take up the full width of the single movie container we are aligning it to flex start so it only take up amount of space that it needs based on the text
    margin-bottom: 32px;
  }

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
        background: #ff4500;
      }
    }
  }

  //this is responsive 
  .movie-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    color: #fff;
   //width: 100%;

    //once it gets to min width of a 800 
    @media (min-width: 800px) {
      flex-direction: row;
      align-items: flex-start; //
    }
    
    .trailer-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: auto;
      
      iframe {
        // width: 100%;
        // max-width: 800px; //100%
        // height: auto;
        // aspect-ratio: 16 / 9; // Responsive video için Oranlı küçülmesini sağlar
        
        max-height: 500px;        
        max-width: 100%;
      }

      @media (min-width: 800px) {
        iframe {
          // display: grid;
          // flex-direction: row;
          // align-items: flex-start; //
          // justify-content: center;

          max-height: 700px;
          width: initial;

           //max-width: 800px;
           //height: auto;
        }
      }

    }

    .movie-img {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%; // Full width kaplamasını sağlar
      height: auto;
      
      img {
        max-height: 500px;        
        max-width: 100%;

        @media (min-width: 800px) {
          max-height: 700px;
          width: initial;
        }
      }
    }

    .movie-content {
      width: 100%;
      padding: 16px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;
      
      h1 {
        font-size: 56px;
        font-weight: 400;
      }

      .movie-fact {
        margin-top: 12px;
        font-size: 20px;
        line-height: 1.5;

        span {
          font-weight: 600;
          text-decoration: underline;
        }
      }

      .tagline {
        font-style: italic;
        span {
          font-style: normal;
        }
      }
    }
  }
}
</style>