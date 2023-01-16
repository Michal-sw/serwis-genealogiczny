<script setup>
import { RouterLink } from 'vue-router';

</script>

<template>
    <header id="navbar">
        <div id="important-buttons-container">
            <RouterLink to="/">Home</RouterLink>
            <RouterLink to="/login">Login</RouterLink>
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
    }

    #important-buttons-container {
        margin-left: auto;
        display:flex;
        flex-direction: row;
        gap: 5vw;
    }
</style>