<script setup lang="ts">
import { type Movie } from '~/types/types';
defineProps<({
    movie: {
        title: string;
        poster_path: string;
        tagline: string;
        release_date: string;
        runtime: number;
        revenue: number;
        overview: string;
  };
})>();
</script>

<template>
    <div class="container single-movie">
        <NuxtLink class="button" :to="{ name: 'index'}">Back</NuxtLink>
        <div class="movie-info">
            <div class="movie-img">
                    <img :src="`https://image.tmdb.org/t/p/w500/${movie.poster_path}`" alt="">
            </div>
            <div class="movie-content">
                    <h1>Title: {{ movie.title }}</h1>
                    <p class="movie-fact tagline">
                        <span>Tagline:</span>"{{ movie.tagline }}"
                    </p>
                    <p class="movie-fact">
                        <span></span>Realesed:
                            {{ 
                                new Date(movie.release_date).toLocaleString('en-us', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                }) 
                            }}
                    </p>
                    <p class="movie-fact">
                        <span>Duration:</span> {{ movie.runtime }} minutes
                    </p>
                    <p class="movie-fact">
                        <span>Revenue:</span>
                        {{
                            movie.revenue.toLocaleString('en-us', {
                            style: 'currency',
                            currency: 'USD',
                            })
                        }}
                    </p>
                    <p class="movie-fact"><span>Overview:</span> {{ movie.overview }}</p>
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