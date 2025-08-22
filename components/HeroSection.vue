<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useTrailerMovie } from '~/composable/useTrailerMovie';

// interface Props {
//   movie: {
//     id: number
//     title: string
//     overview: string
//     backdrop_path?: string
//     vote_average: number
//     release_date: string
//     runtime: number
//   }
// }
// const props = defineProps<Props>()


const movie = ref({
  id: 1307078,
  title: "My Oxford Year",
  overview: "My Oxford Year",
  backdrop_path: "",
  vote_average: 8.5,
  release_date: "2023-10-01",
  runtime: 120
})

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

// Get trailer data
const { data: useTrailer } = await useTrailerMovie(movie.value.id)
if (useTrailer.value.videos && useTrailer.value.videos.results.length) {
  trailer.value = useTrailer.value.videos.results.find((vid: { name: string }) => vid.name === "Official Trailer") || useTrailer.value.videos.results[0]
}

// YouTube Player API
const initializePlayer = () => {
    if (!trailer.value || !window.YT) return

    // Create YouTube player instance
  player.value = new window.YT.Player('youtube-player' as any, {
    height: '100%',
    width: '100%',
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
  <div class="relative h-96 lg:h-[32rem] overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-8">
    
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
    
    <!-- YouTube Player && isVideoPlaying-->
    <div 
      v-if="trailer "
      class="absolute inset-0 w-full h-full"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @click="handleClick"
    >
      <div id="youtube-player" class="w-full h-full"></div>
    </div>
    
    <!-- Gradient Overlay -->
    <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none" />
    
    <!-- Play/Pause Icon Overlay -->
    <div 
      v-if="isVideoPlaying"
      class="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-200"
    >
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
    <div class="absolute inset-0 flex items-center pointer-events-none">
      <div class="px-8 lg:px-16 max-w-2xl">
        <h1 class="text-4xl lg:text-6xl font-bold text-white mb-4">
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
            {{ new Date(movie.release_date).getFullYear() }} • Sci-Fi • {{ movie.runtime }} min
          </span>
        </div>
        
        <p class="text-gray-200 text-lg mb-8 leading-relaxed">
          {{ movie.overview }}
        </p>
        
        <div class="flex space-x-4 pointer-events-auto">
          <button class="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <span>Watch Trailer</span>
          </button>
          
          <button class="flex items-center space-x-2 bg-gray-800/80 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200">
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            <span>More Info</span>
          </button>
          
          <!-- Sound Toggle Button -->
          <button 
            v-if="isVideoPlaying"
            @click="toggleMute"
            class="flex items-center justify-center w-12 h-12 bg-gray-800/80 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200"
          >
            <svg
              v-if="isMuted"
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5zM23 9l-6 6M17 9l6 6"/>
            </svg>
            <svg
              v-else
              class="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure YouTube player fills container properly */
#youtube-player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Hide YouTube player controls */
#youtube-player iframe {
  pointer-events: none;
}

/* Allow clicks on our custom overlay */
.pointer-events-auto {
  pointer-events: auto;
}
</style>




<!-- <script setup lang="ts">

</script>

<template>
    <div class="relative h-96 lg:h-[42rem] overflow-hidden rounded-2xl mx-4 sm:mx-6 lg:mx-8 mt-8">
      <img
        src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1200&h=675&fit=crop"
        alt="Featured Movie"
        class="w-full h-full object-cover"
      />
      
      <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      
      <div class="absolute inset-0 flex items-center">
        <div class="px-8 lg:px-16 max-w-2xl">
          <h1 class="text-4xl lg:text-6xl font-bold text-white mb-4">
            Dune: Part Two
          </h1>
          
          <div class="flex items-center space-x-4 mb-4">
            <div class="flex items-center space-x-1">
              <Star class="h-5 w-5 text-amber-400 fill-current" />
              <span class="text-white font-semibold">8.9</span>
            </div>
            <span class="text-gray-300">2024 • Sci-Fi • 166 min</span>
          </div>
          
          <p class="text-gray-200 text-lg mb-8 leading-relaxed">
            Paul Atreides unites with Chani and the Fremen while seeking revenge against 
            the conspirators who destroyed his family. An epic continuation of the saga.
          </p>
          
          <div class="flex space-x-4">
            <button class="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200">
              <Play class="h-5 w-5" />
              <span>Watch Trailer</span>
            </button>
            
            <button class="flex items-center space-x-2 bg-gray-800/80 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200">
              <Info class="h-5 w-5" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
</template>


<style scoped>

</style> -->