<script setup>
import { storeToRefs } from 'pinia';
import Child from './Child.vue' 
import { useTreeStore } from '../../stores/tree';

const { rootChildren } = storeToRefs(useTreeStore());

</script>

<template>
    <div id="children-menu">
        <h3>Children</h3>
        <Child
            v-bind:key="child.id"
            v-for="child in rootChildren"
            :child="child"
        />
    </div>
</template>

<style lang="scss" scoped>
    #children-menu {
        display:flex;
        flex-direction: column;
        gap:10px;
        width: fit-content;
    }

</style>