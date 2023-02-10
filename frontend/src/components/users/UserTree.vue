<script setup>
import { onBeforeMount } from 'vue';
import { useTreeStore } from '../../stores/tree';
import TreeMember from './TreeMember.vue';
import RootChildren from './RootChildren.vue';
import { storeToRefs } from 'pinia';

const props = defineProps({
    id: String
});

// const rerender = ref(0);

const { rootMember, realRootMember } = storeToRefs(useTreeStore());

onBeforeMount(() => {
    useTreeStore().getAndSetTree(props.id);
})

function goBackToRoot() {
    useTreeStore().changeRoot(realRootMember.value);
}

</script>

<template>
    <h2>User tree</h2>
    <button class="info" @click="goBackToRoot">Go back to true Root</button>
    <div id="wrapper">
        <TreeMember
            :key="rootMember?.id"
            :id="rootMember?.id"
            :props="{name: rootMember?.props?.name, birthDate: rootMember?.props?.birthdate}"
            :branchLevel="1"
        />
    </div>
    <RootChildren/>
</template>

<style lang="scss" scoped>

#wrapper {
    position: relative;
}

button {
    width: fit-content;

}

</style>