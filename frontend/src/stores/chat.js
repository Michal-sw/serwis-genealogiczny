import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getGlobalChat } from '../services/axiosService';

export const useChatStore = defineStore('chat', () => {
    const chat = ref([]);

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
        const notification = { message };
        chat.value = [...chat.value, notification];
    }


    return { chat, addMessage, getAndSetChatHistory };
})
