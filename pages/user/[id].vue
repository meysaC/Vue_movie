<script setup>
import { useAuthStore } from '~/store/auth'
import Navbar from '~/components/Navbar.vue'
import { useUserStore } from '~/store/user'
import { useRoute } from 'vue-router';

// definePageMeta({
//   middleware: 'auth'
// })

const userStore = useUserStore()
const authStore = useAuthStore()
const route = useRoute();

onMounted(async () => {
  let routeId = route.params.id;
  let userId = routeId
  //console.log("id from route [id].vue", id)

  if(!userId) {
    userId = authStore.getUserIdFromToken();
    console.log("[id] userIdFromToken", userIdFromToken);
  }

  if (userId) {
    await userStore.fetchUser(userId);
  }

  // if (!id && authStore.simpleUser && authStore.simpleUser.id) {
  //   id = authStore.simpleUser.id;
  //   console.log("Fallback ID kullanıldı:", id);
  // }

  // if (!id) {
  //   console.error("Kullanıcı ID'si bulunamadı");
  //   return;
  // }
  // await userStore.fetchUser(id);
});

</script>

<template>
  <Navbar />
    <NuxtLink class="button" >Back</NuxtLink> <!-- :to="{ name: 'index'}" -->
    <div v-if="userStore.user" class="p-8">
      <h1 class="text-3xl font-bold mb-6 text-white my-8">
        {{ userStore.user.userName }}'in Profili
      </h1>

    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-white">İzledikleri</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <p class="text-white">girdin</p>
      </div>
    </section>
  </div>
  <div v-else class="text-white p-8">
    Kullanıcı bulunamadı.
  </div>
</template>

<style lang="scss" scoped>
  .button {
    align-self: flex-start;
    margin-bottom: 32px;
  }</style>
