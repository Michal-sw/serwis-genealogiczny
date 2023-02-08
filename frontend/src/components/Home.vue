<script setup>
import { useAuthStore } from '../stores/auth';
import UserTree from './users/UserTree.vue';
import { storeToRefs } from 'pinia';

const { user, authenticated } = storeToRefs(useAuthStore());

</script>

<template>
    <h2>
      Hello {{ user.login }}
      <UserTree 
        :id="user._id"
        :key="authenticated"
      />
    </h2>
</template>

<style scoped>


</style>
