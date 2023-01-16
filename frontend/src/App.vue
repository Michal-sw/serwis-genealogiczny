<script setup>
  import { RouterView } from 'vue-router'
  import NavBar from './components/NavBar.vue';
import Notifications from './components/Notifications.vue';
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
