<script setup>
import { ref } from 'vue';
import { useTreeStore } from '../../stores/tree';
import { storeToRefs } from 'pinia';

const { rootChildren } = storeToRefs(useTreeStore());
const isChildMenuVisible = ref(false);

function setAsRoot(newRoot) {
    useTreeStore().changeRoot(newRoot);
}

</script>

<template>
    <div id="children-menu">
        <h3>Children</h3>
        <div
            v-bind:key="child.id"
            v-for="child in rootChildren"
            @click="() => isChildMenuVisible = !isChildMenuVisible"
        >
            <span v-changeAddMenuVisibility class="tree-member">
                {{ child.props.name }}
            </span>
            <div
                v-if="isChildMenuVisible" 
                id="child-menu-container"
            >
            <button @click="(() => setAsRoot(child))">Set as root</button>
         </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>


</style>