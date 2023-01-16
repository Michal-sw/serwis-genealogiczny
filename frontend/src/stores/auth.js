import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { axiosInstance } from '../../services/axiosService';

export const useCounterStore = defineStore('counter', () => {
  const token = ref("");
  const authenticated = ref(false);

  const clearToken = computed(() => token.value = "");

  function setToken(value) {
    token.value = value

    axiosInstance.interceptors.request
      .use(config => {
        console.log("intercepted");

        return config;
      }, null);  
}

  return { token, authenticated, clearToken, setToken };
})
