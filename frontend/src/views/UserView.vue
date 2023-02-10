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
    <div class="user-view-wrapper" v-if="useAuthStore().authenticated">
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

<style>

.user-view-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 10px;
}
</style>