import { defineStore } from 'pinia'
import { useCookie } from '#app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    registrationForm: {
      username: "",
      email: "",
      password: "",
    },
    //user: null as { username: string; email: string } | null,
    token: useCookie("token").value || null,
    dialog: {
      show: false,
      message: "",
      type: "error"
    }

  }),

  getters: {
    getRegistrationForm(state) {
      return state.registrationForm;
    },
    getToken(state) {
      return state.token;
    },

  },

  actions: {
     //username: string, email: string, password: string
    async register() {
      try {
        const { $myAxios } = useNuxtApp();
        const response = await $myAxios.post(`/account/register`, this.registrationForm);
        if(response.data && response.data.token) {
          this.setToken(response.data.token);
          this.dialog.show = true;
          this.dialog.type = "success";
          this.dialog.message = "Kayıt başarılı!";
        } else {
          throw new Error("Token alınamadı.");
        }

        // const response = await $myAxios.post('/account/register', {
        //   username,
        //   email,
        //   password
        // })
        // this.setUser(response.data)
        // await useNuxtApp()
        // .$myAxios.post(`/account/register`, this.$state.registrationForm)
        // .then(() => {
        //   this.dialog.show = true;
        //   this.dialog.type = "sucess";
        // });

      } catch (e: any) {
        console.error("Register error:",e);
        this.dialog.show = true;
        this.dialog.type = "error";
        this.dialog.message = e?.response?.data?.message || "Kayıt sırasında hata oluştu.";
      }
    },
    
    async login () {
      try {
        const { $myAxios } = useNuxtApp();
        const response = await $myAxios.post(`/account/login`, this.registrationForm);
        if(response.data && response.data.token) {
          this.setToken(response.data.token);
          this.dialog.show = true;
          this.dialog.type = "success";
          this.dialog.message = "Giriş başarılı!";
        } else {
          throw new Error("Token alınamadı.");
        }

      } catch (e: any) {
        console.error("Login error:",e);
        this.dialog.show = true;
        this.dialog.type = "error";
        this.dialog.message = e?.response?.data?.message || "Giriş sırasında hata oluştu.";
      }
    },
    
    setToken(token: string) {
      this.token = token;
      const tokenCookie = useCookie("token", { maxAge: 60 * 60 * 24 * 1 }); // 1 gün boyunca saklanır
      tokenCookie.value = token;
      //useCookie("token").value = token;
    },
    clearToken() {
      this.token = null;
      useCookie("token").value = null;
    },

    logout() {
      this.registrationForm.email = ""
      this.registrationForm.username = ""
      this.registrationForm.password = ""
      this.token = null
    }

  },
})
