import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notifications', () => {
    const notifications = ref([]);

    function addNotification(message) {
        const notification = { message };
        notifications.value = [...notifications.value, notification];
        removeAfterTimeout(message);
    }

    function addError(message) {
        const notification = { message, isError: true };
        notifications.value = [...notifications.value, notification];
        removeAfterTimeout(message);
    }

    function removeAfterTimeout(message) {
        setTimeout(() => {
            notifications.value = notifications.value
                .filter(e => e.message !== message);
        }, 5000)

    }

  return { notifications, addNotification, addError };
})
