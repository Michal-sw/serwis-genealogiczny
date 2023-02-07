<script setup>
import { RouterLink } from 'vue-router';

    defineProps({
        users: Array
    })
</script>

<template>
<div id="user-list-container">
    <RouterLink
        :to="{ name: 'user', params: { id: user._id } }"
        v-bind:key="user.login"
        v-for="user in users"
        class="list-element"
    >
        {{ user.login }}
    </RouterLink>
</div>
</template>

<style>
    #user-list-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 20px;

        background-color: var(--main-color);
        border-radius: 8px;
        width: 55vw;
        padding: 20px;
    }

    .list-element {
        display:flex;
        background-color: var(--secondary-color);
        color: white;
        font-weight: 600;

        transition: 0.1s;

        border-radius: 9px;
        padding: 10px;
        box-shadow: var(--shadow);

        align-items: center;
        justify-content: center;
        min-width: 100px;
    }

    .list-element:hover {
        cursor: pointer;
        background-color: var(--secondary-color-light);
    }

    .list-element:active {
        background-color: var(--secondary-color-dark);
    }
</style>
