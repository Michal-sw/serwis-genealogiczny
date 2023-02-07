<script setup>
import UserDetails from '../components/users/UserDetails.vue';
import UserTree from '../components/users/UserTree.vue';
import Unauthorized from '../components/Unauthorized.vue';
import { useAuthStore } from '../stores/auth';

const props = defineProps({
    id: String
});

</script>

<template>
    <div v-if="useAuthStore().authenticated">
        <UserDetails 
            :id="props.id"
            :key="useAuthStore().authenticated"
        />
        <UserTree
            :id="props.id"
            :key="useAuthStore().authenticated"
        />
    </div>
    <Unauthorized v-else/>
</template>
