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

const { rootMember } = storeToRefs(useTreeStore());

onBeforeMount(() => {
    useTreeStore().getAndSetTree(props.id);
})

</script>

<template>
    <h2>User tree</h2>
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

</style>