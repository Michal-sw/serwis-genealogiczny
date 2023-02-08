import { ref } from 'vue'
import { defineStore } from 'pinia'
import { axiosInstance, logout as logoutRequest } from '../services/axiosService';
import { useNotificationStore } from './notifications'

export const useAuthStore = defineStore('counter', () => {
  const token = ref("");
  const user = ref({});
  const authenticated = ref(false);

  function setAuthData(data) {
    user.value = data.user;
    token.value = data.token;
    authenticated.value = true;
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

    // axiosInstance.interceptors.response.use(config => {
    //   console.log("Request intercepted");
    //   console.log(config.status, config.isRepeated);
    //   if (config.status === 401 && !config.isRepeated) {
    //     console.log("Request 401, refreshing...");
    //     refreshToken()
    //       .then(res => {
    //       console.log("Refresh success");
    //         const token = res.data.token;
    //         if (!token) return;
    //         setToken(token);
    //         config.isRepeated = true;
    //         return axiosInstance.request(config);
    //       });
    //   }
    //   return config;
    // })

  function logout() {
    token.value = "";
    authenticated.value = false;
    axiosInstance.defaults.headers.common['Authorization'] = "";

    logoutRequest()
      .then(_res => useNotificationStore().addNotification("You have been logged out!"))
      .catch(_err => useNotificationStore().addError("Logout unsuccessfull!"));
  }

  return { token, user, authenticated, setAuthData, logout };
})
