<script setup lang="ts">
import { NuxtLink } from '#components';
import { ref, onMounted, onUnmounted } from 'vue'
import { useTrailerMovie } from '~/composable/useTrailerMovie';
import { useNowMovies } from "~/composable/useNowMovies";
import { useSingleMovie } from "~/composable/useSingleMovie";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void
  }
}

// State management
const isHovering = ref(false)
const isVideoPlaying = ref(false)
const isMuted = ref(true)
const isPaused = ref(false)
const hoverTimer = ref<NodeJS.Timeout | null>(null)
const trailer = ref<any>(null)
const player = ref<any>(null)
const movie = ref<any>(null)

//Get Trending Movies 
const { data:nowMovies, error } = await useNowMovies();
if (nowMovies.value && nowMovies.value.results?.length > 0) {
  const randomIndex = Math.floor(Math.random() * nowMovies.value.results.length);
  const randomId = nowMovies.value.results[randomIndex].id;

  const { data: singleMovie } = await useSingleMovie(randomId);
  if (singleMovie.value) {
    movie.value = singleMovie.value;
  }
}

//trailer data 
if(movie.value) {
  const { data: useTrailer } = await useTrailerMovie(movie.value.id)
  if (useTrailer.value.videos && useTrailer.value.videos.results.length) {
    trailer.value = useTrailer.value.videos.results.find((vid: { name: string }) => vid.name === "Official Trailer") || useTrailer.value.videos.results[0]
  }
}

// YouTube Player API
const initializePlayer = () => {
    if (!trailer.value || !window.YT) return

    // Create YouTube player instance
  player.value = new window.YT.Player('youtube-player' as any, {
    // height: '100%',
    // width: '100%',
    videoId: trailer.value.key,
    playerVars: {
      autoplay: 1,
    //   mute: 1,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      playsinline: 1,
      rel: 0,
      showinfo: 0,
      loop: 1,
      playlist: trailer.value.key
    },
    events: {
      onReady: (event: any) => {
        //event.target.setVolume(0)
        event.target.mute()
        event.target.playVideo()
      },
      // This event is triggered when the player is ready
      // window.YT.PlayerState.PLAYING  window.YT.PlayerState.PAUSED
      onStateChange: (event: any) => {
        if (event.data === 1) { //playing
          isVideoPlaying.value = true
        } else if (event.data === 2) { //paused
          isVideoPlaying.value = false
        }
      }
    }
  })
}

// Load YouTube API
const loadYouTubeAPI = () => {
  if (window.YT && window.YT.Player) {
    initializePlayer()
    return
  }

  const script = document.createElement('script')
  script.src = 'https://www.youtube.com/iframe_api'
  script.async = true
  document.head.appendChild(script)

  window.onYouTubeIframeAPIReady = () => {
    initializePlayer()
  }
}

// Event handlers
const handleMouseEnter = () => {
  isHovering.value = true
  hoverTimer.value = setTimeout(() => {
    if (isHovering.value && trailer.value && !isVideoPlaying.value) {
      isVideoPlaying.value = true
      if (player.value) {
        // player.value.playVideo()
      }
    }
  }, 1000)
}

const handleMouseLeave = () => {
  isHovering.value = false
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value)
  }
}

const handleClick = () => {
  if (isVideoPlaying.value && player.value) {
    if (isPaused.value) {
       player.value.playVideo()
      isPaused.value = false
    } else {
    //    player.value.pauseVideo()
      isPaused.value = true
    }
  }
}

const toggleMute = () => {
  if (player.value) {
    if (isMuted.value) {
      player.value.unMute()
      player.value.setVolume(50)
      isMuted.value = false
    } else {
      player.value.mute()
      isMuted.value = true
    }
  }
}

onMounted(() => {
  if (trailer.value) {
    loadYouTubeAPI()
  }
})

onUnmounted(() => {
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value)
  }
})
</script>

<template>
  <div class="relative h-96 lg:h-[40rem] overflow-hidden mx-4 mt-8">
    
    <!-- Main Image -->
    <img
      :src="`https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop`"
      :alt="movie.title"
      class="w-full h-full object-cover transition-opacity duration-300"
      :class="{ 'opacity-0': isVideoPlaying }"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
    />
    
    <!-- YouTube Player -->
    <div 
      v-if="trailer"
      class="absolute inset-0 w-full h-full"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
    >
      <div id="youtube-player" class="absolute top-1/2 left-1/2 w-full h-full min-w-[177.77vh] min-h-[55vw] -translate-x-1/2 -translate-y-1/2"></div> <!-- w-full h-full-->
    </div>
    <!-- <div @click="handleClick" class="absolute inset-0 bg-gradient-to-t from-[#111827] via-gray-900/50 to-transparent" /> -->
    

    <!-- Play/Pause Icon Overlay -->
    <div v-if="isVideoPlaying" class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-200">
      <div class="bg-black/50 rounded-full p-4">
        <svg
          v-if="isPaused"
          class="h-12 w-12 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z"/>
        </svg>
        <svg
          v-else
          class="h-12 w-12 text-white"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>
      </div>
    </div>
    
    <!-- Content -->
    <div class="absolute inset-0 flex items-end lg:items-center pointer-events-none lg:pt-[150px]">
      <div class="px-8 lg:px-16 max-w-2xl">
        <div class="hover:opacity-100" :class="{ 'opacity-50 ': isVideoPlaying }">
          <h1 class="text-xl lg:text-6xl font-bold text-white mb-4">
            {{ movie.title }}
          </h1>
          
          <div class="flex items-center space-x-4 mb-4">
            <div class="flex items-center space-x-1">
              <svg class="h-5 w-5 text-amber-400 fill-current" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span class="text-white font-semibold">{{ movie.vote_average.toFixed(1) }}</span>
            </div>
            <span class="text-gray-300">
              {{ new Date(movie.release_date).getFullYear() }} • {{ movie.runtime }} min
            </span> <!-- • Sci-Fi -->
          </div>
          
          <p class="hidden sm:block text-gray-200 text-lg mb-8 leading-relaxed sm:line-clamp-2">
            {{ movie.overview.slice(0,250) }}
            <span v-if="movie.overview.length > 250">...</span>
          </p>
        </div>
        
        <div class="flex space-x-4 pointer-events-auto">
          <NuxtLink :to="{name: 'movies-id', params: { id: movie.id}}" class="button button-light flex items-center text">More Info</NuxtLink>
          
          <!-- Sound Toggle Button -->
          <button 
            v-if="isVideoPlaying"
            @click="toggleMute"
            class="button button-light flex items-center justify-center"> <!-- w-12 h-12 bg-gray-800/80 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200-->
            <svg
              v-if="isMuted"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/>
            </svg>
            <svg
              v-else
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          </button>
        </div>

      </div>
    </div>

  </div>
</template>

<style scoped>
</style>