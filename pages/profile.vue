<script setup>
import { useAuthStore } from '~/store/auth'
import Navbar from '~/components/Navbar.vue'

definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
</script>

<template>
  <div v-if="authStore.registrationForm.username">
    <h1>Hoş geldin, {{ authStore.registrationForm.username }}!</h1>
    <p>Email: {{ authStore.registrationForm.email }}</p>
    <button @click="authStore.logout">Çıkış Yap</button>
  </div>
</template>
