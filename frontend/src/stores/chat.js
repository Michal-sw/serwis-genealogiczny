import { ref } from 'vue'
import { defineStore } from 'pinia'
import { createSocket } from '../services/websocketService';

export const useChatStore = defineStore('chat', () => {
    const chat = ref([]);
    const socket = ref({});

    function initWebsocket() {
        socket.value = createSocket();
    }

    // function getAndSetChatHistory() {
    //     getGlobalChat()
    //         .then(res => {
    //             console.log(res.data);
    //             if (res.data.messages) {
    //                 chat.value = res.data.messages;
    //             }
    //         })
    // }

    function setHistory(data) {
        chat.value = data;
    }

    function addMessage(message) {
        chat.value = [...chat.value, message];
    }

    function sendMesssage(data) {
        socket.value.emit('message', data);
    }


    return { chat, addMessage, sendMesssage, setHistory, initWebsocket };
})
