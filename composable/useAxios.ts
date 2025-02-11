import axios from "axios";

export const useAxios = () => {
  const config = useRuntimeConfig(); // API Key'i al

  const api = axios.create({
    baseURL: config.public.TMDB_BASE_URL, //"https://api.themoviedb.org/3/", 
    // headers: {
    //   Authorization: `Bearer ${config.TMDB_API_KEY}`, 
    // },
  });


//   const api = "https://www.omdbapi.com/?i=tt3896198&apikey=a76fd39b";

  return api;
};
