import { defineStore } from 'pinia'
import type { Movie } from '~/types/types';
import type { User } from "~/types/user"

export interface Result<T> {
  success: boolean;
  error: string | null;
  data: T;
}


export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
        favorites: {} as Record<string, Movie[]>, // Movie göre favori filmler
        watched: {} as Record<string, Movie[]>,
        dialog: {
            show: false,
            message: "",
            type: "error"
          }
      
    }),
    getters: {
      isAuthenticated: (state) => {
        return state.user !== null;
      },
      getUser: (state) => {
        return state.user;
      }
    },
    actions: {
      async fetchUser(id: string): Promise<User | null> {
          try {
            const { $myAxios } = useNuxtApp();
            const {data: user } = await $myAxios.get<User>(`/user/get_user`, {
              params: { id } 
          });
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
        async AddtoFavorites(movieId: number) {
          try {
            const { $myAxios } = useNuxtApp();
            const response = await $myAxios.post(`/user/add_favorite/${movieId}`
            );
            return response.data;
          } catch (error) {
            console.error("AddtoFavorites error", error);
            this.dialog = {
              show: true,
              type: "error",
              message: "Favorilere eklenirken hata oluştu."
            };
            
          }
        },
        async fetchFavoriteMovies(userId: string): Promise<Movie[] | null> { 
          try {
            const { $myAxios } = useNuxtApp();
            const response = await $myAxios.get<Result<Movie[]>>(`/user/all_favorites/${userId}`); //BÖYLE OLDUĞUNDA PATH PARAMETRESİ OLARAK GİDİYOR DİĞER TÜRLÜ(FETCHDSER DAKİ ) QUERY OLUR //this.user?.id --> böyle olmamalı çünkü diğer kullanıcınıların favorilerine de bakabilmek istiyorum
            
            this.favorites[userId] = response.data.data; //!!!!!!!!!!!!!!
            return response.data.data;
          } catch (error) {
            console.error("allFavorites error", error);
            this.dialog = {
              show: true,
              type: "error",
              message: "Favoriler alınırken hata oluştu."
            };
            return null
          } 
        },
        async addToWatchList(movieId: number) {
          try {
            const { $myAxios } = useNuxtApp();
            const response = await $myAxios.post(`/user/watchlist`, {
              movieId: movieId
            });
            return response.data;
          } catch (error) {
            console.error("addToWatchList error", error);
            this.dialog = {
              show: true,
              type: "error",
              message: "İzleme listesine eklenirken hata oluştu."
            };
          }
        },
        async addToWatched(movieId: number) {
          try {
            console.log("addToWatched movieId", movieId);
            const { $myAxios } = useNuxtApp();
            const response = await $myAxios.post(`/user/add_watched/${movieId}`);
            console.log("addToWatched response", response);
          } catch (error) {
            console.error("addToWatched error", error);
            this.dialog = {
              show: true,
              type: "error",
              message: "İzlenmiş olarak işaretlenirken hata oluştu."
            };
          }
        },
        async fetchWatchedMovies(userId: string): Promise<Movie[] | null> {
          try {
            const { $myAxios} = useNuxtApp();
            const response = await $myAxios.get<Result<Movie[]>>(`/user/all_watched/${userId}`);
            this.watched[userId] = response.data.data;
            console.log("fetchwatched user store", response.data.data)
            return response.data.data
          } catch (error) {
            console.error("fetchWatchedMovies error", error);
            this.dialog = {
              show: true,
              type: "error",
              message: "İzlenmiş filmler alınırken hata oluştu."
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