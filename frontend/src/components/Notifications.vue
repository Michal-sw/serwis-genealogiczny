<script setup>
    import { storeToRefs } from 'pinia';
    import { useNotificationStore } from '../stores/notifications'
    const { notifications } = storeToRefs(useNotificationStore());
</script>

<template>
    <div id="notification-container">
        <div 
            v-bind:key="notification.message"
            v-for="notification in notifications" 
            v-bind:class="notification.isError ? 'danger' : 'green'"
            class="notification"
        >
            {{ notification.message }}
        </div>
    </div>
</template>

<style scoped>

    #notification-container {
        position: absolute;

        display:flex;
        flex-direction: column;
        gap: 5px;

        text-align: center;
        align-items: center;

        z-index: 1;

        top: 10px;
        margin-left: auto;
        margin-right: auto;
        left: 0;
        right: 0;
        width:fit-content;
    }

    .notification {
        display:flex;
        opacity: 60%;
        font-weight: 700;
        border-radius: 15px;

        justify-content: center;
        align-items: center;

        min-width: 40vw;
        min-height: 10vh;
    }

</style>
