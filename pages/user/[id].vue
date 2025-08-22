<script setup>
import Navbar from '~/components/Navbar.vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '~/store/user'
import Watched from '~/components/Profile/WatchedTab'
import  Favorites  from '~/components/Profile/FavoritesTab'
import { ref, computed, onMounted, watch  } from 'vue'
import { useAuthStore } from '~/store/auth'

const route = useRoute()
const userStore = useUserStore()
const authStore = useAuthStore()

// const routeUserId = route.params.id; 

const activeTab = ref('watched')
const tabComponents = {
  favorites: Favorites,
  watched: Watched
  // watchlist: Watchlist,
}
const tabs = [
  { key: 'watched', label: 'Watched' },
  { key: 'favorites', label: 'Favorites' }
  // { key: 'watchList', label: 'Watch List' },
]

/** COMPUTED */
//sadece reactive bağımlılıkları değişirse çalışır.İçinde reactive bir şey değişmezse tekrar çalışmaz.( otomatik cache’li getter gibi)
const userId = computed(() => {
  return authStore.getterUserIdFromToken //route.params.id || userStore.getUserIdFromToken()     userStore String(başka bir kullanıcı id si route ile, giriş yapmuş kullanıcı id auth jwt token üzerinden
});
const routeUserId = computed(() => route.params.id)

const currentProfile = computed(() => userStore.getUser)
const isFollowing = computed(() => userStore.isFollowing(userId.value)); //!!giriş yapan kullanıcı idsi, profilindeki kullanıcının followers içerisinde var ise kontrolü yapar!!
const followings = computed(() =>userStore.getFollowings); 
const followers = computed(() =>userStore.getFollowers);
const followingsCount = computed(() => userStore.getFollowingCount); 
const followersCount = computed(() =>userStore.getFollowerCount);


/** FUNCTION */
async function toggleFollow() {
  try {
    await userStore.toggleFollow(routeUserId); //userId.value 
  } catch (error) {
    console.error("Takip işlemi başarısız", error);
  }
}

/** ONMOUNTED */
// Sayfa açıldığında memory'yi doldur
//sayfa her açıldığında güncellenir böylece computed otomatik güncellenir.
// onMounted(async () => {
//   await userStore.fetchUser(routeUserId.value); 
//   await userStore.fetchFollowings(routeUserId.value)
//   await userStore.fetchFollowers(routeUserId.value)
//   console.log("userId",userId.value)
//   console.log("routeUserId",routeUserId.value)
// });


//İlk mount olduğunda veriyi çekiyor
//Param değişince tekrar fetch yapıyor
onMounted(() => fetchProfile(route.params.id))
watch(() => route.params.id, async (newId) => {
  await fetchProfile(newId)
})
let lastFetchedId = null
async function fetchProfile(id) {
  if (!id) return; // id yoksa backende istek atma
  if (!id || id === lastFetchedId) return lastFetchedId = id //aynı id ye gereksiz istek atılmasın

  await userStore.fetchUser(id)
  await userStore.fetchFollowings(id)
  await userStore.fetchFollowers(id)
}



//onMounted (fetch) ilk açıldığında  bileşen dom a ilk eklendiğinde,     
//computed (getter) ile çek değer değiştiğinde çalışır bir kaynaktan türeyen hesaplanmış bir değeri döndürür bu değeri cache’ler (önbellekler), sadece bağımlı olduğu reactive değer değişirse yeniden hesaplar!!
//store da getter olan kullandığımızda zaten reaktif old. için computed falan gerek yok

//7d45a22b-e6e3-42be-a536-2d50c3ccf73c  blackworld
//4438c635-382b-467f-af56-fb3d6ee37743 movie3333
</script>

<template>
  <Navbar />

  <div class="w-full overflow-x-hidden max-w-screen pt-4">
    
    <!-- Banner -->
    <div id="Banner" class="w-full">
      <div class="w-full">
        <div class="relative w-full h-[400px] sm:h-[500px] md:h-[600px]">
            <!-- IMAGE -->
            <div class="absolute inset-0">
                <img src="/assets/imgs/movieHero.jpg" alt="shot" class="absolute top-0 left-0 w-full h-full object-cover">
            </div>

            <!--Follow buton -->
            <div class="absolute top-4 right-4 z-30">
              <button v-if="routeUserId !== userId" type="button" href="" class="button text-sm" 
                :class="isFollowing ? '' : 'bg-green-500 hover:bg-green-700'"
                @click="toggleFollow"
              >{{ isFollowing ? "Unfollow" : "Follow" }}</button>
            </div>

            <!-- Information -->
            <div class="absolute bottom-0 left-0 w-full z-20">
              <div class="flex flex-col items-start">
                <!-- Avatar -->
                <div class="flex w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 ml-4"></div>
                <!-- Info Bar -->
                <div class="flex justify-end bg-black/50  w-full py-2 px-0 md:px-4">
                  <p class="text-white pr-4">{{ currentProfile.userName }}</p>
                  <div class="flex flex-col text-center text-white">
                    <NuxtLink to="/" class="text-white hover:text-red-800 text-lg pr-4">Followings</NuxtLink>
                    <p>{{ followingsCount }}</p>
                  </div>
                  <div class="flex flex-col text-center text-white  mr-4">
                    <NuxtLink to="/" class="text-white hover:text-red-800 text-lg">Followers</NuxtLink> 
                    <p>{{ followersCount }}</p>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="mt-8 border-b border-gray-200 ml-6">
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
       :userId="routeUserId"
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
