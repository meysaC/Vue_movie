<script setup lang="ts">
    import { Loading } from "#components";
    import { useNowMovies } from "~/composable/useNowMovies";
    import { useSearchMovie } from "~/composable/useSearchMovie";

  const { data,  error } = await useNowMovies(); // Şu an oynayan filmler pending,
  const searchInput = ref(""); //kullanıcı arama metni
  const { data: searchResults, refresh } = await useSearchMovie(searchInput); // Arama sonuçları

  if(data.value != "") console.log("hi");

    useHead({
      title: 'Movie App - Latest Streaming Movie Info',
      meta: [
       // hid: 'description',
       {hid: 'description' ,name: 'description', content: 'My amazing site.' }
      ]
    });
  // useSeoMeta({
  //   title: "Movie App - Latest Streaming Movie Info",
  // });
</script>


<template>
    <div class="home">
        <!-- Hero -->
        <Hero/>

        <!-- Search -->
        <div class="container search">
            <!-- v-model ->>> we wanna hook up a data value to this input to capture the user's search term  -->
            <!-- v-model.lazy->instead of updating on each keystroke its gonna update when te user enters and leaves the actual input itself-->
            <input 
            @key.enter=""   
            v-model="searchInput" 
            type="text"
            placeholder="Search" /> 
            <button v-show="searchInput !== ''"  @click="searchInput = ''" class="button">Clear Search</button> <!-- v-show -> we wanna show this button if something was in the input -->
        </div>

        <Loading v-if="searchResults?.status === 'pending'"/>

        <!-- Movies -->
        <div v-else class="container movies">

              <!-- Search Movie -->
            <div v-if="searchInput !== ''" id="movie-grid" class="movies-grid">
                <div class="movie" 
                  v-for="movie in searchResults?.results" 
                  :key="movie.id">
                    <div class="movie-img">
                        <img :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`" alt="">
                        <p class="review">{{ movie.vote_average }}</p> <!--movie divinin içinde çünkü overview ü absolute olarak imagenin üstünde göstermek istiyoruz -->
                        <p class="overview">{{ movie.overview }}</p>
                    </div>
                    <div class="info">
                        <p class="title">
                            {{ movie.title.slice(0, 25) }} 
                            <span v-if="movie.title.length > 25">...</span> <!-- direk p içerisine yazsaydı 25 karakterden az ise ... gözükmüş olcaktı o yüzden spna ile 25den fazlaysa gösteriyoruz-->
                        </p>
                        <p class="release">
                            Realesed:
                            {{ 
                                new Date(movie.release_date).toLocaleString('en-us', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                }) 
                            }}
                        </p>
                        <NuxtLink 
                            class="button button-light" 
                            :to="{name: 'movies-id', params: { id: movie.id}}"
                            >
                            Get More Info
                        </NuxtLink>
                    </div>
                </div>
            </div>

            <!-- Now Streaming -->
            <div v-else id="movie-grid" class="movies-grid">
                <div class="movie" 
                  v-for="movie in data?.results" 
                  :key="movie.id">
                    <div class="movie-img">
                        <img :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`" alt="">
                        <p class="review">{{ movie.vote_average }}</p> <!--movie divinin içinde çünkü overview ü absolute olarak imagenin üstünde göstermek istiyoruz -->
                        <p class="overview">{{ movie.overview }}</p>
                    </div>
                    <div class="info">
                        <p class="title">
                            {{ movie.title.slice(0, 25) }} 
                            <span v-if="movie.title.length > 25">...</span> <!-- direk p içerisine yazsaydı 25 karakterden az ise ... gözükmüş olcaktı o yüzden spna ile 25den fazlaysa gösteriyoruz-->
                        </p>
                        <p class="release">
                            Realesed:
                            {{ 
                                new Date(movie.release_date).toLocaleString('en-us', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                }) 
                            }}
                        </p>
                        <NuxtLink 
                            class="button button-light" 
                            :to="{name: 'movies-id', params: { id: movie.id}}"
                            >
                            Get More Info
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>


<style lang="scss">
.home {
  .loading {
    padding-top: 120px;
    align-items: flex-start;
  }

  .search {
    display: flex;
    padding: 32px 16px;

    input {
      max-width: 350px; 
      width: 100%; //max with 350px will take up 100% of the space if it is perhaps lower 
      padding: 12px 6px;
      font-size: 14px;
      border: none;

      //outline dan kurtulmak için 
      &:focus {
        outline: none;
      }
    }

    //input ile yan yana old ve bütün gözükmesini istediğimiz için default olarak butonda olan radious dan kurtuluyoruz
    .button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  .movies {
    padding: 32px 16px; //around everything
    .movies-grid {
      display: grid;
      column-gap: 32px; //coulmn gap var 
      row-gap: 64px;
      grid-template-columns: 1fr; //default olarak mobile de one column var 
      //500 a çıktığında 2 column var
      @media (min-width: 500px) {
        grid-template-columns: repeat(2, 1fr);
      }
      @media (min-width: 750px) {
        grid-template-columns: repeat(3, 1fr);
      }
      @media (min-width: 1100px) {
        grid-template-columns: repeat(4, 1fr);
      }

      .movie {
        position: relative;
        display: flex;
        flex-direction: column;

        .movie-img {
          position: relative;
          overflow: hidden;

          //aşağıda overview için düzenleme yapmıştık hover ile de üstüne geldiğinde translate y 0 ile goes back to original position 
          &:hover {
            .overview {
              transform: translateY(0);
            }
          }

          img {
            display: block;
            width: 100%;
            height: 100%;
          }

          //en soldaki puanlama için absolute yapıp 0,0 ile en sola alıyoruz
          .review {
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 40px;
            height: 40px;
            background-color: #c92502;
            color: #fff;
            border-radius: 0 0 16px 0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
              0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }

          .overview {
            line-height: 1.5;
            position: absolute;
            bottom: 0;
            background-color: rgba(201, 38, 2, 0.9);
            padding: 12px;
            color: #fff;
            transform: translateY(100%); //translate Y 100 which will take this off by 100 percents meaning NOTHİNG WİLL BE SHOWİNG
            transition: 0.3s ease-in-out all; //3 mili seconds sonra ease in out all yukarı doğu çıkıyo!!!
          }
        }

        .info {
          margin-top: auto;
          .title {
            margin-top: 8px;
            color: #fff;
            font-size: 20px;
          }

          .release {
            margin-top: 8px;
            color: #c9c9c9;
          }

          .button {
            margin-top: 8px;
          }
        }
      }
    }
  }
}
</style>