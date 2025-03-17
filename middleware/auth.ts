import { useAuthStore } from '~/store/auth'

//Yetkilendirilmiş sayfalara erişimi kısıtlamak için middleware ekleyelim.
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()
  if (!authStore.token) {
    return navigateTo('/user/login')
  }
})
