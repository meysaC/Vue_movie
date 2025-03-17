<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/store/auth'

const authStore = useAuthStore()
const loading = ref(false);

const submitRegister = async () => {
  loading.value = true;
  await authStore.register();
  loading.value = false;
};

</script>


<template>
  <div class="register-container">
    <form @submit.prevent="submitRegister">
      <input v-model="authStore.registrationForm.username" placeholder="Kullanıcı Adı" required />
      <input v-model="authStore.registrationForm.email" type="email" placeholder="Email" required />
      <input v-model="authStore.registrationForm.password" type="password" placeholder="Şifre" required />
      <button type="submit" :disabled="loading">
        {{ loading ? "Kaydediliyor..." : "Kayıt Ol" }}
      </button>
    </form>
    <p v-if="authStore.dialog.show" :class="`dialog ${authStore.dialog.type}`">
      {{ authStore.dialog.message }}
    </p>
  </div>
</template>

<style scoped>
.register-container {
  max-width: 400px;
  margin: auto;
  text-align: center;
}
input {
  display: block;
  width: 100%;
  margin: 10px 0;
  padding: 8px;
}
button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}
.dialog {
  margin-top: 10px;
  padding: 10px;
}
.dialog.success {
  background-color: #d4edda;
  color: #155724;
}
.dialog.error {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
