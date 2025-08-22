import { defineStore } from 'pinia'
import { useCookie } from '#app'
import type { SimpleUser, User } from '~/types/user'
import { useUserStore } from './user';


export const useAuthStore = defineStore('auth', {
  state: () => ({
    registrationForm: {
      id: "",
      userName: "",
      email: "",
      password: ""
    },
    user: null as User | null,
    token: useCookie("token").value || null, //benim token 
    stateToken: useCookie("stateToken").value || null, //google login için gerekli state token 
    dialog: {
      show: false,
      message: "",
      type: "error"
    }

  }),

  getters: {
    getToken(state) {
      return state.token;
    },
    isAuthenticated(): boolean {
      return !!this.token;
    },
    getUser(state) {
      return state.user;
    },
    getterUserIdFromToken(state) {
      return state.user?.id
    }
  },

  actions: {
    async fetchUser(userId: string): Promise<User | null> {
      try {
        const { $myAxios } = useNuxtApp();
        const {data: user } = await $myAxios.get<User>(`/users/${userId}`);
        this.user = user;
        return user;
      } catch (error) {
        console.error("setUser error", error);
        this.dialog = {
          show: true,
          type: "error",
          message: "Kullanıcı bilgileri çekilirken hata oluştu."
        };
        return null;
      }
    },
    async register() {
      try {
        const { $myAxios } = useNuxtApp();
        const response = await $myAxios.post(`/account/register`, this.registrationForm);
        if(response?.data?.token) {
          //await this.setUser(response);
          const token = response.data.token;
          await this.setToken(token);
          const id = await this.getUserIdFromToken(token);
          //const tokenUserId = tokenUser?.sub;
          if(id !== null) {
            //const userStore = useUserStore();
            const fetchedUser = await this.fetchUser(id);
            if (fetchedUser) {
              this.user = fetchedUser;
            }          
          }

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
        if(response?.data?.token) {
          const token = response.data.token;
          await this.setToken(response.data.token);
          //await this.setUser(response);
          
          //token ı decode et kullanıcı bilgilerini al
          const id = await this.getUserIdFromToken(token);
          //const tokenUserId = tokenUser?.sub;
          if(id !== null) {
            //const userStore = useUserStore();
            const fetchedUser = await this.fetchUser(id);
            if (fetchedUser) {
              this.user = fetchedUser;//; userStore.user direk userStore.user dan almak daha iyi
              console.log("auth login",this.user)
            }          
          }

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
      if (stateFromQuery !== storedState) {
          throw new Error("The oauth state was missing or invalid. google-callback");
        } else {
          try {
            const { $myAxios } = useNuxtApp();
            const response = await $myAxios.get("/account/google-callback", {
              params: { code, state: stateFromQuery },
            });

            if (response.data?.token) {
              const token = response.data.token;
              await this.setToken(token);
              const id = await this.getUserIdFromToken();
              if(id !== null) {
                //const userStore = useUserStore()
                const fetchedUser = await this.fetchUser(id);
                if(fetchedUser) {
                  this.user = fetchedUser;
                }
              }
              
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
            } finally {
              const tokenCookie = useCookie("stateToken");
              tokenCookie.value = null;
              this.stateToken = null;
            }
        }
    },
    //async old için dönüş tipi  olmalı Promise<string | null>
    async getUserIdFromToken(tokenArg?: string):Promise<string | null>  {
      const token = tokenArg || useCookie('token').value; //gönderilen token dan ya da önceki kayıtlı token ı al
      if (!token) return null;

      try {
        const base64Payload = token.split('.')[1];
        const payload = JSON.parse(atob(base64Payload));
        return payload.sub || null;
      } catch (e) {
        console.error("Token parsing failed", e);
        return null;
      }
    },
    async init() {
      //token varsa ama user yoksa
      if(this.token && !this.user ) {
        const id = await this.getUserIdFromToken(this.token)
        if(id) {
          const userStore = useUserStore();
          const fetchedUser = await userStore.fetchUser(id);
          if(fetchedUser) {
            this.user = userStore.user;
          }
        }
      }
    },
    async setUser(response: any){
      // const { id, userName, email } = response.data;
      // this.simpleUser = {id, userName, email } as SimpleUser;
      // console.log("auth store set Simpleuser", this.simpleUser);
      this.user = response; //????????
    },
    async setToken(token: string) {
      this.token = token;
      const tokenCookie = useCookie("token", { maxAge: 60 * 60 * 24 * 1 }); // 1 gün boyunca saklanır
      tokenCookie.value = token;
      //useCookie("token").value = token;
    },
    clearUser() {
      this.registrationForm = {
        id: "",
        userName: "",
        email: "",
        password: ""
      };
      this.user = null;
      //this.simpleUser = null;
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
