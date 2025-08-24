<script setup lang="ts">
import { NuxtLink } from '#components';
import { ref } from 'vue'
import { useAuthStore } from '~/store/auth'

const isMenuOpen = ref(false);
const isProfileMenuOpen = ref(false)
const showLoginModal = ref(false)
const showRecommendModal = ref(false)

const authStore = useAuthStore()

const onToggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
}

const onToggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

const logout = async () => {
  authStore.logout();
  isProfileMenuOpen.value = false
  await navigateTo('/');
}
</script>

 
 <template>
    <!-- custom-reset bg-gradient-to-t give the linear gradient color from [..] this color ( bg-gradient-to-t from-[#fbc2eb] to-[#a6c1ee] h-screen)-->
    <div class="only-tailwind">  <!--bg-[#] font-[Poppins-Light]-->  
        <nav class="flex justify-between items-center w-[92%] mx-auto transition-all duration-500"
          :class="isMenuOpen ? 'pb-[268px]' : 'pb-0'"  > <!--pb değil mb olcak!!!  flex(yan yana gelir) justify-between(aralarında boşluk olur) items-center(y düzleminde ortalı kalır), w-[92%]->nav width tüm widthin 92 sini kaplar, mx-auto(hepsi center lı) -->
            <NuxtLink to="/">
              <img class="w-[140px] " src="/public/moviepx-logo (2).png"> <!--MoviePx_logo-->
            </NuxtLink>
            
            <!--md:static(buton ve iconla yan yana olucak listeler yoksa biri yukarda biri aşağıda oluyo)-->
            <div 
              :class="isMenuOpen ? 'top-[9%]' : 'top-[-100%]' "
              class="absolute flex items-center md:static md:min-h-fit md:w-auto w-full left-0 px-5 pt-5 duration-500 "> <!--min-h-[60vh] absolute dicez sonra diğerlerinde fixed direction vericez screen lerde(küçük ekranlarda row(satır satır) büyük ekranlarda col(sütun sütun)) w-full(açıldığı zaman tüm widthi kaplar)-->
              <ul class="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 list-none"> <!--duration-500(animasyonlu açılıyor liste) list-none-> corePlugins.preflight: false yaptığın için tarayıcı varsayılan stilleri korunuyor,Tailwind'de list-style'ı kaldırmak için  -->
                <li>
                  <NuxtLink to="/" class="text-white hover:text-gray-500">Home</NuxtLink>
                </li>
                <li>
                  <div class="flex items-center cursor-pointer space-x-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-lg hover:from-amber-400 hover:to-orange-400 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-amber-500/25">
                    <NuxtLink  @click="showRecommendModal = true">Get Inspired!</NuxtLink>
                    <img src="/assets/imgs/Sparkles.svg" alt="" class="w-4 h-4 ">
                  </div>
                </li>
                <li v-if="authStore?.isAuthenticated" @click.outside class="relative text-white">
                  <a :href="`/user/${authStore?.user?.id}`">
                    <img @click="onToggleProfileMenu"  src="/assets/imgs/AccountIcon.svg" class="w-8 h-8 cursor-pointer" alt="profil"/>
                  </a>                  
                </li>
                <li v-if="authStore?.isAuthenticated" >
                  <button @click="logout" class="button button-light">Logout</button> 
                </li>
                <li v-else>
                  <button @click="showLoginModal = true" class="button">Login</button>                
                </li>
              </ul>
            </div>

            <div class="flex items-center gap-4"> <!-- the button under align properly -->
              <Icon 
                @click="onToggleMenu"
                style="color: #ffffff;"
                :name="isMenuOpen ? 'tdesign:close' : 'tdesign:view-list' "  
                class="text-xl cursor-pointer md:hidden"/>
            </div>
        </nav>
        <LoginModal :show="showLoginModal" @close="showLoginModal = false" />
        <ReccommendModal :show="showRecommendModal" @close="showRecommendModal = false" />
    </div>
 </template>
 

 <style scoped>
.button-nav {
  background-color: transparent;
  border: 1px solid #c92502 ;
  border-radius: 4px;
  transition: 0.3s ease all; /* bunu hover olduğunda yumuşak şekilde geçiş sağlasın diye */
}
.button-nav:hover {
      background-color: #891b02;
}
 </style>