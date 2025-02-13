<script setup lang="ts">
import { useSingleMovie } from '~/composable/useSingleMovie';
    const nuxt = useNuxtApp(); 
    definePageMeta({
        layout: "default",
    })
    const route = useRoute();
    const { data,  error } = await useSingleMovie(route.params.id as string); 
    
    useHead({
      title: `${data.value.title}`,
    });

</script>


<template>
        <Loading v-if="data?.status === 'pending' && data.length > 0"/>       
        <div v-else class="container single-movie">
            <NuxtLink class="button" :to="{ name: 'index'}">Back</NuxtLink>
            <div class="movie-info">
                <div class="movie-img">
                    <img :src="`https://image.tmdb.org/t/p/w500/${data.poster_path}`" alt="">
                </div>
                <div class="movie-content">
                    <h1>Title: {{ data.title }}</h1>
                    <p class="movie-fact tagline">
                        <span>Tagline:</span>"{{ data.tagline }}"
                    </p>
                    <p class="movie-fact">
                        <span></span>Realesed:
                            {{ 
                                new Date(data.release_date).toLocaleString('en-us', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                }) 
                            }}
                    </p>
                    <p class="movie-fact">
                        <span>Duration:</span> {{ data.runtime }} minutes
                    </p>
                    <p class="movie-fact">
                        <span>Revenue:</span>
                        {{
                            data.revenue.toLocaleString('en-us', {
                            style: 'currency',
                            currency: 'USD',
                            })
                        }}
                    </p>
                    <p class="movie-fact"><span>Overview:</span> {{ data.overview }}</p>
                </div>
            </div>
        </div>
</template>

<style lang="scss" scoped>
.single-movie {
  color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 32px 16px;

  .button {
    align-self: flex-start; //doesnt take up the full width of the single movie container we are aligning it to flex start so it only take up amount of space that it needs based on the text
    margin-bottom: 32px;
  }

  //this is responsive 
  .movie-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    color: #fff;
    //once it gets to min width of a 800 
    @media (min-width: 800px) {
      flex-direction: row;
      align-items: flex-start;
    }
    .movie-img {
      img {
        max-height: 500px;
        width: 100%;

        @media (min-width: 800px) {
          max-height: 700px;
          width: initial;
        }
      }
    }

    .movie-content {
      h1 {
        font-size: 56px;
        font-weight: 400;
      }

      .movie-fact {
        margin-top: 12px;
        font-size: 20px;
        line-height: 1.5;

        span {
          font-weight: 600;
          text-decoration: underline;
        }
      }

      .tagline {
        font-style: italic;
        span {
          font-style: normal;
        }
      }
    }
  }
}
</style>