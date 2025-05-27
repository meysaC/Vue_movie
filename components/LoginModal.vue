<script setup lang="ts">
import { ref, watch, defineProps, defineEmits  } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useRouter } from 'vue-router'

const props = defineProps<{ show: boolean }>()
const emit = defineEmits(['close'])

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

const close = () => {
  emit('close')
}

watch(() => authStore.token, (newToken) => {
  if (newToken !== null) {
    setTimeout(() => {
      //router.push('/profile')  // Yönlendirme işlemi
      emit('close')
    }, 1000) // 1 saniye bekleme
  }
})
//movie3333 Password_3333
</script>


<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
    <div class="bg-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
      <button @click="close" class="absolute top-2 rigth-2 text-gray-500 hover:text-black">
        ✕
      </button>
  <!-- Login Form -->
    <form @submit.prevent="submitLogin">
      <input 
        v-model="authStore.registrationForm.userName" 
        placeholder="Kullanıcı Adı" 
        required 
        class="w-full my-2 p-2 border rounded"/>
      <input 
        v-model="authStore.registrationForm.password" 
        type="password" 
        placeholder="Şifre" 
        required 
        class="w-full my-2 p-2 border rounded"/>
      <button type="submit" :disabled="loading" class="w-full bg-[#28a745] text-white my-2 p-2 border mt-2">
        {{ loading ? "Giriş yapılıyor..." : "Giriş Yap" }}
      </button>
    </form>
    <p v-if="authStore.dialog.show" :class="`dialog ${authStore.dialog.type}`">
      {{ authStore.dialog.message }}
    </p>
    <button @click="authStore.googleLogin()" class="w-full bg-[#4285f4] text-white p-2 rounded mt-2" > <!-- class="google-login-btn" -->
      Google ile Giriş Yap
    </button>
  </div>
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
/* button {
  width: 100%;
  padding: 10px;
  background-color: #28a745;
  color: white;
  border: none;
  cursor: pointer;
}
.google-login-btn {
  background-color: #4285f4;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
} */
</style>
