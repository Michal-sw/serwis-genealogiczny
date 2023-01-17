import { ref } from 'vue'
import { defineStore } from 'pinia'
import { axiosInstance, logout as logoutRequest } from '../services/axiosService';
import { useNotificationStore } from './notifications'

export const useAuthStore = defineStore('counter', () => {
  const token = ref("");
  const authenticated = ref(false);

  function setToken(value) {
    token.value = value
    authenticated.value = true;
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token.value}`;
  }

  function logout() {
    token.value = "";
    authenticated.value = false;
    axiosInstance.defaults.headers.common['Authorization'] = "";

    logoutRequest()
      .then(_res => useNotificationStore().addNotification("You have been logged out!"))
      .catch(_err => useNotificationStore().addError("Logout unsuccessfull!"));
  }

  return { token, authenticated, setToken, logout };
})
