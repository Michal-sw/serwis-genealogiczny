import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notifications', () => {
    const notifications = ref([]);

    function addNotification(notification) {
        notifications.value = [...notifications.value, notification];
        
        setTimeout(() => {
            notifications.value = notifications.value
                .filter(e => e.message !== notification.message);
        }, 5000)
    }

    function addError(notification) {
        const errorNotification = { message: notification.message, isError: true }
        addNotification(errorNotification);
    }

  return { notifications, addNotification, addError };
})
