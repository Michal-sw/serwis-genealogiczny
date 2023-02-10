<script setup>
import { onBeforeMount } from 'vue';
import { useTreeStore } from '../../stores/tree';
import TreeMember from './TreeMember.vue';
import RootChildren from './RootChildren.vue';
import { storeToRefs } from 'pinia';
import { RouterLink } from 'vue-router';

const props = defineProps({
    id: String
});

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
    <button v-if="rootMember?.id" class="info" @click="goBackToRoot">Go back to true Root</button>
    <div v-if="!rootMember?.id">
            <RouterLink :to="{ name: 'addRootMember', params: { id: props.id } }">
                <button class="green">Add Root</button>
            </RouterLink>
    </div>
    <div id="wrapper" v-else>
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
    min-height: 200px;
}

button {
    width: fit-content;

}

</style>