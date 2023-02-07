<script setup>
import { } from 'vue';

const props = defineProps({
        id: String
    });


</script>

<template>
    <h2>User view</h2>
    <div>ID {{ props.id }}</div>
</template>
