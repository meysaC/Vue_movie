import axios from 'axios'
//import { useAuthStore } from '~/store/auth'

export default defineNuxtPlugin(() => {
  // axios.defaults.baseURL = 'https://localhost:5188/api' //http://localhost:5188/api //backend bu portta çalışıyor olabilir??

  // axios.interceptors.request.use((config) => {
  //   const authStore = useAuthStore()
  //   if (authStore.token) {
  //     config.headers.Authorization = `Bearer ${authStore.token}`
  //   }
  //   return config;
  // })

  const axiosConfig = {
    baseURL: 'https://localhost:5188/api',
  };

  const axiosServices = axios.create(axiosConfig);

  axiosServices.interceptors.request.use(async function (config) {
    const accessToken = useCookie('token', { secure: true }); //cookie güvenliği için secure: true ekleyerek sadece HTTPS üzerinde saklanmasını 

    try {
      if (accessToken && accessToken.value) {
        config.headers['Authorization'] = `Bearer ${accessToken.value}`;
      } //else if(!config.ignoreToken) {
      //   console.log("info", config.ignoreToken);
      //   navigateTo('/api/account/login', {
      //       external: true
      //   });
      //   console.error("There is no access token.");
      //   return config;  
      // }
      config.headers['Accept'] = 'application/json';
    } catch (error) {
      console.error("Error setting request headers:", error);
    }
    return config;
  }, error => {
    console.error("Request error:", error);
    return Promise.reject(new Error(error));

  });

  axiosServices.interceptors.response.use(
    response => response,
    error => {
        // Check for unauthorized response
        if (error.response && error.response.status === 401) {
            console.error("Access token expired. Redirecting to logout.");
            navigateTo('/api/account/logout', {
                external: true
            });

        } 
        else if (error.response && error.response.status === 403) {
            console.error("Access forbidden. Redirecting to logout.");
            navigateTo('/api/account/logout', {
                external: true
            });
        }
        else {
            console.error("Response error:", error);
        }
        return Promise.reject(new Error(error.response?.data || "Service error"));
    }
);

  return {
    provide: {
      myAxios: axiosServices,
    }
  }
})
