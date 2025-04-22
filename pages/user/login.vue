<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useRouter } from 'vue-router'

const showLoginModal = ref(false);

const authStore = useAuthStore()
const loading = ref(false);
const router = useRouter();

const submitLogin = async () => {
  loading.value = true;
  await authStore.login();
  loading.value = false;
};

const googleLogin = () => {
  authStore.googleLogin();
};

watch(() => authStore.token, (newToken) => {
  if (newToken !== null) {
    setTimeout(() => {
      router.push('/profile')  // Yönlendirme işlemi
    }, 1000) // 1 saniye bekleme
  }
})
//movie3333 Password_3333
</script>


<template>
  <!-- <div class="register-container">
    <form @submit.prevent="submitLogin">
      <input v-model="authStore.registrationForm.username" placeholder="Kullanıcı Adı" required />
      <input v-model="authStore.registrationForm.password" type="password" placeholder="Şifre" required />
      <button type="submit" :disabled="loading">
        {{ loading ? "Giriş yapılıyor..." : "Giriş Yap" }}
      </button>
    </form>
    <p v-if="authStore.dialog.show" :class="`dialog ${authStore.dialog.type}`">
      {{ authStore.dialog.message }}
    </p>
    <button @click="googleLogin" class="google-login-btn">
      Google ile Giriş Yap
    </button>
  </div> -->
  google giriş
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
.google-login-btn {
  background-color: #4285f4;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}
</style>
