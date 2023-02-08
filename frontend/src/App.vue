<script setup>
  import { RouterView } from 'vue-router'
  import NavBar from './components/NavBar.vue';
  import Notifications from './components/Notifications.vue';
  import { onBeforeMount } from 'vue';
  import { refreshToken } from './services/axiosService';
  import { useAuthStore } from './stores/auth';
  
  onBeforeMount(() => {
    refreshToken()
      .then(res => {
        const token = res.data.token;
        if (!token) return;
        useAuthStore().setAuthData(res.data);
      })
      .catch(err => console.log(err));
  });

</script>

<template>
    <Notifications />
    <NavBar />
  <main>
    <RouterView/>
  </main>
</template>

<style scoped>

  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

</style>
