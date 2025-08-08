import { defineStore } from 'pinia'
import type { Movie } from '~/types/types';
import type { User } from "~/types/user"

export interface Result<T> {
  success: boolean;
  error: string | null;
  data: T;
}

export interface FollowDto {
  id: number;
  followerId: string
  followerUserName: string;
  followingId: string;
  followingUserName: string;
  isActive: boolean;
  followedWhen: string;
  unFollowedWhen?: string | null;
}

export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as User | null,
        favorites: {} as Record<string, Movie[]>, // Movie göre favori filmler
        watched: {} as Record<string, Movie[]>,
        followings: [] as FollowDto[], 
        followers: [] as FollowDto[], 
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
      },
      isFollowing: (state) => (userId: string) =>
        state.followers.some(f => f.followerId === userId && f.isActive),
      getFollowings: (state) => state.followings,
      getFollowers: (state) => state.followers,
      getFollowingCount: (state) => state.followings.length,
      getFollowerCount: (state) => state.followers.length,
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
          if(this.favorites[userId]) return this.favorites[userId]; //daha önce çekildiyse cachdeki filmi gönderiyoruz
          try {
            const { $myAxios } = useNuxtApp();
            const response = await $myAxios.get<Result<Movie[]>>(`/user/all_favorites/${userId}`); //BÖYLE OLDUĞUNDA PATH PARAMETRESİ OLARAK GİDİYOR DİĞER TÜRLÜ(FETCHDSER DAKİ ) QUERY OLUR //this.user?.id --> böyle olmamalı çünkü diğer kullanıcınıların favorilerine de bakabilmek istiyorum
            
            this.favorites[userId] = response.data.data;
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
          if(this.watched[userId]) return this.watched[userId];
          try {
            const { $myAxios} = useNuxtApp();
            const response = await $myAxios.get<Result<Movie[]>>(`/user/all_watched/${userId}`);
            this.watched[userId] = response.data.data;
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
        },


        async toggleFollow(followingId: string) {
          const { $myAxios } = useNuxtApp();
          try {
            const response = await $myAxios.post(`/user/follow/${followingId}`);
            const data = response.data as {
              followId: number;
              isFollowing: boolean;
              followedWhen: string;
              unFollowedWhen?: string | null;
            };

            const existing = this.followings.find((f) => f.followingId === followingId); //Memory’de bu kullanıcıyı zaten takip ediyor muyuz

            if (data.isFollowing) {
              if (existing) {
                existing.isActive = true;
                existing.followedWhen = data.followedWhen;
                existing.unFollowedWhen = null;
              } else {
                // memory'e yeni ekle
                this.followings.push({
                  id: data.followId,
                  followerId: this.user!.id,
                  followerUserName: this.user!.userName,
                  followingId,
                  followingUserName: "", 
                  isActive: true,
                  followedWhen: data.followedWhen,
                  unFollowedWhen: null,
                });
              }
            } else {
              // Takip bırakıldı
              if (existing) {
                existing.isActive = false;
                existing.unFollowedWhen = data.unFollowedWhen ?? null;
              }
              // İstersen memory'den komple kaldırabilirsin:
              this.followings = this.followings.filter((f) => f.followingId !== followingId);
            }

            return data.isFollowing;
          } catch (error) {
            console.error("toggleFollow error", error);
            this.dialog = {
              show: true,
              type: "error",
              message: "Takip işlemi başarısız.",
            };
            throw error;
          }
        },
        async fetchFollowings(userId: string) {
          const { $myAxios } = useNuxtApp()
          try {
            const response = await $myAxios.get(`/user/followings/${userId}`);
            this.followings = response.data;
            return response.data
          } catch (error) {
            console.error("fetchFollowings error", error);
            this.dialog = {
              show: true,
              type: "error",
              message: "Kullanıcının takip ettikleri çekilemedi.",
            };
            throw error;
          }
        },
        async fetchFollowers(userId: string) {
          const { $myAxios } = useNuxtApp()
          try {
            const response = await $myAxios.get(`/user/followers/${userId}`);
            this.followers = response.data;
            return this.followers
          } catch (error) {
            console.error("fetchFollowers error", error);
            this.dialog = {
              show: true,
              type: "error",
              message: "Kullanıcının takipçileri çekilemedi.",
            };
            throw error;
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