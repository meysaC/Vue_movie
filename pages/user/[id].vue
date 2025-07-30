<script setup>
import Navbar from '~/components/Navbar.vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/store/user'
import Watched from '~/components/profile/WatchedTab'
import  Favorites  from '~/components/profile/FavoritesTab'
import { ref, computed, onMounted } from 'vue'

const route = useRoute()
const userStore = useUserStore()

const activeTab = ref('favorites')
const tabComponents = {
  watched: Watched,
  favorites: Favorites//defineAsyncComponent(() => import('~/components/profile/FavoritesTab'))
  // watchlist: Watchlist,
}
const tabs = [
  { key: 'watched', label: 'Watched' },
  { key: 'favorites', label: 'Favorites' }
  // { key: 'watchList', label: 'Watch List' },
]

const userId = computed(() => {
  return route.params.id || userStore.getUserIdFromToken();
});
onMounted(async () => {
  // let routeId = route.params.id;
  // let userId = routeId
  // //console.log("id from route [id].vue", id)

  // if(!userId) {
  //   userId = userStore.getUserIdFromToken();
  //   console.log("[id] userIdFromToken", userId);
  // }
  // if (userId) {
  const user = await userStore.fetchUser(userId.value);
  //}
});
</script>

<template>
  <Navbar />
  <div class="max-w-6xl mx-auto p-4">
    <!-- Banner -->
    <div class="h-40 md:h-64 w-full bg-cover bg-center shadow" :style="{ backgroundImage: 'url(/565053.jpg)' }"></div>

    <!-- Profil Bilgisi -->
    <div class="relative mt-12 md:-mt-20 flex items-center space-x-4 px-4">
      <div class="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow bg-gray-300 flex items-center justify-center text-3xl text-white font-bold">
        <!-- {{ userInitial }} -->
      </div>
      <div>
        <h1 class="text-xl font-semibold bg-white rounded-md">{{ userStore.user.userName }}</h1> <!--{{ user?.userName }}-->
        <div class="flex items-center text-sm text-gray-500 space-x-2">
          <span></span> <!--{{ user.gender }}  {{ user.yearsActive }}-->
          <span>•</span>
          <span> yıldır üye</span>
        </div>
      </div>
      <div class="ml-auto flex space-x-4">
        <div class="text-center">
          <div class="text-lg font-semibold"></div><!--{{ user.following }}-->
          <div class="text-sm text-gray-500">Followings</div>
        </div>
        <div class="text-center">
          <div class="text-lg font-semibold"></div> <!--{{ user.followers }}-->
          <div class="text-sm text-gray-500">Followers</div>
        </div>
      </div>
    </div>

    <!-- Sayı Özetleri 
    <div class="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div v-for="(value, key) in summary" :key="key" class="bg-gray-100 p-4 rounded shadow">
        <div class="text-2xl font-bold">{{ value }}</div>
        <div class="text-sm text-gray-600">{{ summaryTitles[key] }}</div>
      </div>
    </div>-->


    <!-- Tab Navigation -->
    <div class="mt-8 border-b border-gray-200">
      <nav class="flex space-x-4">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="py-2 px-4 text-sm font-medium border-b-2"
          :class="activeTab === tab.key
            ? 'border-black text-black'
            : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Dinamik İçerik -->
    <div class="flex-1 overflow-y-auto p-6 ">
      <component
       v-if="tabComponents[activeTab]"
       :is="tabComponents[activeTab]" 
       :userId="userId"
      />
    </div>

  </div>
  
</template>

<style lang="scss" scoped>
  .button {
    align-self: flex-start;
    margin-bottom: 32px;
  }
</style>
