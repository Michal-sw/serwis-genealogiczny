<script setup>
import { ref, computed } from 'vue';
import { useTreeStore } from '../../stores/tree';
import { useNotificationStore } from '../../stores/notifications';
import router from '../../router';
import { deleteMember } from '../../services/axiosService';
import { storeToRefs } from 'pinia';

const props = defineProps(['child']);

const isChildMenuVisible = ref(false);

const treeStore = useTreeStore();

const isRoot = computed(() => {
  return props.child?.id === treeStore.realRootMember?.id
})


function setAsRoot() {
    treeStore.changeRoot(props.child);
}
function onDelete() {
    const isSure = confirm("Are you sure?");
    const isRoot = props.child.id === treeStore.realRootMember?.id
    if (!isSure || isRoot) return;
    deleteMember(treeStore.treeOwnerId, props.child.id)
      .then(_res => {
        treeStore.refreshTree();
      })
      .catch(_err => useNotificationStore().addError("Can not delete node!"));
}

</script>

<template>
    <div
        @click="() => isChildMenuVisible = !isChildMenuVisible"
    >
        <span class="tree-member">
            {{ props.child?.props?.name }}
        </span>
        <div
            v-if="isChildMenuVisible" 
            id="child-menu-container"
        >
            <button @click="setAsRoot">Set as root</button>
            <button v-if="!isRoot" class="danger" @click="onDelete">Delete node</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>


</style>