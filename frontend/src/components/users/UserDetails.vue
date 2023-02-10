<script setup>
import { onBeforeMount, ref } from 'vue';
import { getUserById } from '../../services/axiosService';
import { useNotificationStore } from '../../stores/notifications';

const props = defineProps({
    id: String
});

const user = ref({});

onBeforeMount(() => {
    getUserById(props.id)
        .then(res => {
            user.value = res.data;
        })
        .catch(_err => useNotificationStore().addError("Could not get user!"))
})

</script>

<template>
    <div>
        <h2>User view</h2>
        <div>ID {{ props.id }}</div>
        <p>{{ user.login }}</p>
    </div>
</template>
