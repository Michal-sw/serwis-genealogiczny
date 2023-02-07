<script setup>
import { onBeforeMount, ref } from 'vue';
import { getUserTreeById } from '../../services/axiosService';
import { useNotificationStore } from '../../stores/notifications';

const props = defineProps({
    id: String
});

const userTree = ref([]);

onBeforeMount(() => {
    getUserTreeById(props.id)
        .then(res => {
            userTree.value = res.data;
        })
        .catch(err => useNotificationStore().addError("Could not get user tree!"))
})

</script>

<template>
    <h2>User tree</h2>
    <div
        v-bind:key="index"
        v-for="(member, index) in userTree" 
    >
        {{member}}
    </div>
</template>
