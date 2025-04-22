<script setup lang="ts">
import { NuxtLink } from '#components';
import { ref } from 'vue'
import { useAuthStore } from '~/store/auth'

const isMenuOpen = ref(false);
const isProfileMenuOpen = ref(false)
const showLoginModal = ref(false)

const authStore = useAuthStore()

const isSignedin = computed(() => authStore.token !== null);
const linkTo = computed(() => (isSignedin.value ? '/user/login' : '/user/register'));
const linkText = computed(() => (isSignedin.value ? 'Hesabım' : 'Signin'));

const onToggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
}

const onToggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
}

//const googleLogin = () => authStore.googleLogin();
const logout = () => {
  authStore.logout();
  isProfileMenuOpen.value = false
}

const user = computed(() => authStore.getUser); 
// onMounted(() => {
//   authStore.fetchUser()
// })
// export default {
//   directives: {
//     clickOutside: {
//       mounted(el, binding) {
//         el.clickOutsideEvent = (event) => {
//           if (!(el == event.target || el.contains(event.target))) {
//             binding.value(event);
//           }
//         };
//         document.addEventListener("click", el.clickOutsideEvent);
//       },
//       unmounted(el) {
//         document.removeEventListener("click", el.clickOutsideEvent);
//       },
//     }
//   }
// }

</script>

 
 <template>
    <!-- custom-reset bg-gradient-to-t give the linear gradient color from [..] this color ( bg-gradient-to-t from-[#fbc2eb] to-[#a6c1ee] h-screen)-->
    <div  class="only-tailwind bg-[#211f1f]">  <!-- font-[Poppins-Light]-->  
        <nav class="flex justify-between items-center w-[92%] mx-auto transition-all duration-500"
          :class="isMenuOpen ? 'pb-64' : 'pb-0'"  > <!--pb değil mb olcak!!!  flex(yan yana gelir) justify-between(aralarında boşluk olur) items-center(y düzleminde ortalı kalır), w-[92%]->nav width tüm widthin 92 sini kaplar, mx-auto(hepsi center lı) -->
            <div>
                <img class="w-14 " src="/assets/imgs/MoviePx_logo.png">
            </div>
            
            <!--md:static(buton ve iconla yan yana olucak listeler yoksa biri yukarda biri aşağıda oluyo)-->
            <div 
              :class="isMenuOpen ? 'top-[9%]' : 'top-[-100%]' "
              class="absolute flex items-center md:static md:min-h-fit md:w-auto w-full left-0 px-5 pt-5 duration-500 "> <!--min-h-[60vh] absolute dicez sonra diğerlerinde fixed direction vericez screen lerde(küçük ekranlarda row(satır satır) büyük ekranlarda col(sütun sütun)) w-full(açıldığı zaman tüm widthi kaplar)-->
              <ul class="flex md:flex-row flex-col md:items-center md:gap-[4vw] gap-8 list-none"> <!--duration-500(animasyonlu açılıyor liste) list-none-> corePlugins.preflight: false yaptığın için tarayıcı varsayılan stilleri korunuyor,Tailwind'de list-style'ı kaldırmak için  -->
                <li>
                  <NuxtLink to="/" class="text-white hover:text-gray-500">Ana Sayfa</NuxtLink>
                </li>
                <li>
                  <NuxtLink to="/" class="text-white hover:text-gray-500">Listeler</NuxtLink>
                </li>
                <li v-if="authStore.isAuthenticated" @click.outside class="relative text-white">
                  <img @click="onToggleProfileMenu"  src="/assets/imgs/AccountIcon.svg" class="w-8 h-8 cursor-pointer "  alt="profil"/>
                  <!--Açılır Profil Menü -->
                  <div v-if="isProfileMenuOpen"  class="absolute rigth-0 mt-2 w-40 bg-white shadow-lg z-50 mb-[1000px]">
                    <ul class="py-2 text-sm">
                     <!-- <li class="py-2 px-4">
                        <NuxtLink to="/profile" class="text-black">Hoş geldin {{ authStore.registrationForm?.username }} !</NuxtLink>
                      </li>-->
                      <li class="py-2 px-4">
                        <NuxtLink to="/profile" class="text-black">Profil</NuxtLink>
                      </li>
                      <li class="py-2 px-4 hover:bg-gray-100">
                        <button @click="logout" class="button button-light text-black hover:text-white">Çıkış Yap</button> 
                      </li>
                    </ul>
                  </div>                                 
                </li>
                <li v-else>
                  <!-- <NuxtLink to="/user/login">Giriş Yap</NuxtLink> -->
                  <button @click="showLoginModal = true" class="button button-light">Giriş Yap</button>                
                </li>
              </ul>
            </div>

            <div class="flex items-center gap-4"> <!-- the button under align properly -->
             <!-- <NuxtLink :to="linkTo" class="button-nav text-white h-6 px-5">{{ linkText }}</NuxtLink> button button-light class a button u ekleyince default.scss deki buton ayarları kullanılıyo-->
              
              <Icon 
                @click="onToggleMenu"
                style="color: #ffffff;"
                :name="isMenuOpen ? 'tdesign:close' : 'tdesign:view-list' "  
                class="text-xl cursor-pointer md:hidden"/> <!--cursor-pointer(fare el şeklinde) md:hidden (büyük ekranlarda gizli olucak)-->
            </div>
        </nav>
        <LoginModal :show="showLoginModal" @close="showLoginModal = false" />
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