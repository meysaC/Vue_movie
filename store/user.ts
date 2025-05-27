import { defineStore } from 'pinia'
import type { User } from "~/types/user"

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
        dialog: {
            show: false,
            message: "",
            type: "error"
          }
      
    }),
    
    actions: {
      async fetchUser(id: string): Promise<User | null> {
          try {
            const { $myAxios } = useNuxtApp();
            const {data: user } = await $myAxios.get<User>(`/user/get_user`, {
              params: { id } 
          });

            this.user = user;
            console.log("gelen user user store:", this.user);
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
        }

        // getUserIdFromToken(): string | null {
        //   const token = useCookie('token');
        //   if (!token.value) return null;

        //   try {
        //     const base64Payload = token.value.split('.')[1];
        //     const payload = JSON.parse(atob(base64Payload));
        //     return payload.sub || null; // sub içine koyduk
        //   } catch (e) {
        //     console.error("Token parsing failed", e);
        //     return null;
        //   }
        // }
    
    }
})