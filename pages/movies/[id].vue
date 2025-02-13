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
        <MovieDetails v-else :movie="data"/>         
</template>

<style lang="scss" scoped>

</style>