import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getGlobalChat } from '../services/axiosService';
import { createSocket } from '../services/websocketService';
import  { useAuthStore } from './auth';

export const useChatStore = defineStore('chat', () => {
    const chat = ref([]);
    const socket = ref({});

    function initWebsocket() {
        socket.value = createSocket();
    }

    function getAndSetChatHistory() {
        getGlobalChat()
            .then(res => {
                console.log(res.data);
                if (res.data.messages) {
                    chat.value = res.data.messages;
                }
            })
    }

    function addMessage(message) {
        const notification = { author: useAuthStore().user._id, text: message };
        socket.value.
        chat.value = [...chat.value, notification];
    }


    return { chat, addMessage, getAndSetChatHistory, initWebsocket };
})
