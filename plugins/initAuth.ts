import { useAuthStore } from "../store/auth"

export default defineNuxtPlugin(async (nuxtApp) => {
    const autStore = useAuthStore();
    await autStore.init();
});