import { useAuthStore } from "../store/auth"

export default defineNuxtPlugin(async (nuxtApp) => {
    console.log("plugin initAuth çalıştı")
    const autStore = useAuthStore();
    await autStore.init();
});