<script setup>
import { RouterLink } from 'vue-router';
import { useAuthStore } from '../stores/auth';

</script>

<template>
    <header id="navbar">
        <div id="important-buttons-container">
            <RouterLink to="/">Home</RouterLink>
            
            <RouterLink 
                v-if="!useAuthStore().authenticated" 
                to="/login"
            >
                <button class="green">Login</button>
            </RouterLink>
        
            <button v-else
                @click="useAuthStore().logout()"
                class="danger"
            >Logout</button>
        </div>
    </header>
</template>

<style>
    header {
        display: flex;
        flex-direction: row;
        line-height: 1.5;
        max-height: 100vh;
        gap: 5vw;
        width: 100%;

        align-items: center;
        justify-content: center;
    }

    #important-buttons-container {
        margin-left: auto;
        display:flex;
        flex-direction: row;
        gap: 5vw;
    }
</style>