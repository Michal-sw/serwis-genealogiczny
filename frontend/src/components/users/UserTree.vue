<script setup>
import { onBeforeMount, ref } from 'vue';
import { getUserTreeById } from '../../services/axiosService';
import { useNotificationStore } from '../../stores/notifications';
import { useTreeStore } from '../../stores/tree';
import TreeMember from './TreeMember.vue';
import RootChildren from './RootChildren.vue';
import { storeToRefs } from 'pinia';

const props = defineProps({
    id: String
});

const rerender = ref(0);

const { rootMember } = storeToRefs(useTreeStore());

onBeforeMount(() => {
    getUserTreeById(props.id)
        .then(res => {
            const root = res.data.find(v => v.id === "8");
            useTreeStore().createChildrenMap(res.data);
            useTreeStore().createParentMap(res.data);
            useTreeStore().changeRoot(root);

            rerender.value += 1;
        })
        .catch(_err => useNotificationStore().addError("Could not get user tree!"))
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