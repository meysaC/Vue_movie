import { defineStore } from 'pinia'
import { useCookie } from '#app'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    registrationForm: {
      id: "",
      userName: "",
      email: "",
      password: ""
    },
    token: useCookie("token").value || null, //benim token 
    stateToken: useCookie("stateToken").value || null, //google login için gerekli state token 
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
    isAuthenticated(): boolean {
      return !!this.token;
    },
    getUser(state) {
      return state.registrationForm;
    }
  },

  actions: {
    async fetchUser() {
      try {
        const { $myAxios } = useNuxtApp();
        const response = await $myAxios.get("/user/me");
        if(response.data) {
          this.registrationForm = {
            id: response.data.id,
            userName: response.data.userName,
            email: response.data.email,
            password: response.data.password ?? ""
          };
        }
      } catch (error) {
        console.error("setUser error", error);
        this.dialog = {
          show: true,
          type: "error",
          message: "Kullanıcı bilgileri çekilirken hata oluştu."
        };
      }
    },
    async register() {
      try {
        const { $myAxios } = useNuxtApp();
        const response = await $myAxios.post(`/account/register`, this.registrationForm);
        if(response.data && response.data.token) {
          await this.setUser(response);
          await this.setToken(response.data.token);
          this.dialog = {
            show: true,
            type: "success",
            message: "Kayıt başarılı!"
          };
        } else {
          throw new Error("Token alınamadı.");
        }
      } catch (e: any) {
        console.error("Register error:",e);
        this.dialog = {
          show: true,
          type: "error",
          message: e?.response?.data?.message || "Kayıt sırasında hata oluştu."
        };
      }
    },
    
    async login () {
      try {
        const { $myAxios } = useNuxtApp();
        const response = await $myAxios.post(`/account/login`, this.registrationForm);
        if(response.data && response.data?.token) {
          await this.setUser(response);
          await this.setToken(response.data.token);
          
          this.dialog = {
            show: true,
            type: "success",
            message: "Giriş başarılı!"
          };
        } else {
          throw new Error("Token alınamadı.");
        }

      } catch (e: any) {
        console.error("Login error:",e);
        this.dialog = {
          show: true,
          type: "error",
          message: e?.response?.data?.message || "Giriş sırasında hata oluştu."
        };
      }
    },

    //backend’den google giriş url + stateToken(cookie ye yazılır) si alınır ve kullanıcı url ye yönlendirilir
    async googleLogin() {
      try {
        const { $myAxios } = useNuxtApp();
        const response = await $myAxios.get("/account/google_login_url");
        if (response.data && response.data?.url && response.data?.stateToken) {
          // useCookie("stateToken").value = response.data.stateToken;
          useCookie("stateToken", {
            path: "/", //Cookie'nin hangi sayfalarda geçerli olduğunu belirler.(mesela Sadece /auth altındaki route'larda erişilir)
            sameSite: "lax", // strict yaparsan bazı callback'lerde sorun olabilir(mesela Tarayıcı cookie’yi kaydetmeye izin vermeyebilir)
            secure: false,  // localde false, production'da true yap
            maxAge: 300, // 5 dk
          }).value = response.data.stateToken;
          window.location.href = response.data.url; // google login sayfasına yönlendir
        }
      } catch (error) {
        console.error("Google Login Error:", error);
        this.dialog = {
          show: true,
          type: "error",
          message: "Google ile giriş sırasında hata oluştu."
        };
      };
    },

    //backend’den gelen googleLogin de kaydedilmiş olan state tokenı query den gelen state token ile eşleşiyor mu kont. eder, 
    // queryden gelen code u backend e iletir --->>> response olarak kullanıcı bilgilerini alıp store a kaydeder.
    async googleCallback(code: string, stateFromQuery: string) {
      const storedState = useCookie("stateToken").value;
        if (!code || !stateFromQuery) {
          console.error("Code or state missing in callback");
        } else if (stateFromQuery !== storedState) {
          throw new Error("The oauth state was missing or invalid. google-callback");
        } else {
          try {
            const { $myAxios } = useNuxtApp();
            const response = await $myAxios.get("/account/google-callback", {
              params: { code, state: stateFromQuery },
            });

            if (response.data && response.data?.token) {
              await this.setToken(response.data.token);
              await this.setUser(response.data);
              this.dialog = {
                show: true,
                type: "success",
                message: "Google ile giriş başarılı!"
              };
            } else {
              throw new Error("Google giriş başarısız oldu.Sunucudan token alınamadı.");
            }
          } catch (error) {
            console.error("Google Callback Error:", error);
            this.dialog = {
              show: true,
              type: "error",
              message: "Google ile giriş sırasında hata oluştu."
            };
          }
          finally {
            const tokenCookie = useCookie("stateToken");
            tokenCookie.value = null;
            this.stateToken = null;
          }
        }
    },

    async setUser(response: any){
      this.registrationForm = {
        id: response.data.id,
        userName: response.data.userName || "",
        email: response.data.email || "",
        password: ""
      };
      console.log("set user veri:",this.registrationForm);
    },
    clearUser() {
      this.registrationForm = {
        id: "",
        userName: "",
        email: "",
        password: ""
      };
    },
    async setToken(token: string) {
      this.token = token;
      const tokenCookie = useCookie("token", { maxAge: 60 * 60 * 24 * 1 }); // 1 gün boyunca saklanır
      tokenCookie.value = token;
      //useCookie("token").value = token;
    },
    clearToken() {
      // useCookie("token").value = null;
      const tokenCookie = useCookie("token");
      tokenCookie.value = null;  // Alternatif olarak removeCookie("token") kullanabilirsin
      this.token = null;
    },
    logout() {
      this.clearToken();
      this.clearUser();
    }

  },
})
