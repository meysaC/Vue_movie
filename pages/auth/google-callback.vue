<script setup>
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { onMounted } from 'vue';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

// const code = route.query.code;
// const stateFromQuery = route.query.state;
// if(!code || !stateFromQuery) {
//   console.error("Code or state missing in callback");
//   router.push('/')
// } else {
//   await auth.googleCallback(code, stateFromQuery)
//     .then(() => {
//       router.push('/'); //başarılıysa yönlendirilcek sayfa
//     })
//     .catch(err => {
//       console.error('Callback error:', err)
//         router.push('/login');
//     })
// }

onMounted(async () => {
  const code = route.query.code;
  const stateFromQuery = route.query.state;
  if(!code || !stateFromQuery) {
    console.error("Code or state missing in callback");
    router.replace('/') // replace: history’ı doldurmadan geçiş
  }

  try {
    await auth.googleCallback(code, stateFromQuery)
    router.replace('/')
  } catch (error) {
    console.error('Callback error:', err)
    router.replace('/');
  }

})

//const stateFromCookie = useCookie("stateToken").value;

// if (!code || !stateFromQuery) {
//   console.error("Code or state missing in callback");
//   router.push("/");
// } else if (stateFromQuery !== stateFromCookie) {
//   console.error("The oauth state was missing or invalid. google-callback");
//   router.push("/");
// } else {
//   // her şey doğru, backend'e callback isteği gönder
//     try {
//       const { $myAxios } = useNuxtApp();
//       const response = await $myAxios.get("/account/google-callback", {
//         params: { code, state: stateFromQuery }
//       });

//       if (response.data?.token) {
//       useCookie("token").value = response.data.token;
//       auth.setUser(response);
//       router.push("/"); 
//     } else {
//       console.error("Token response missing");
//       router.push("/login");
//     }
//     } catch (e) {
//       console.error("Callback error:", e);
//       router.push("/");
//     }
// }
</script>

<template>
    <div>
      <p>Google ile giriş yapılıyor, lütfen bekleyin...</p>
    </div>
  </template>
