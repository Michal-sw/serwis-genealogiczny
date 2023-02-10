<script setup>
import { reactive } from 'vue';
import { useChatStore } from '../stores/chat';
import { useAuthStore } from '../stores/auth';
import { storeToRefs } from 'pinia';

const messageModel = reactive({
    text: ""
});

const { chat } = storeToRefs(useChatStore());

function sendMessage() {
    useChatStore().sendMesssage({
        author: useAuthStore().user?._id,
        text: messageModel?.text
    })
    messageModel.text = "";
}

</script>

<template>
    <div id="chat-container">
        <h3>Chat</h3>
        <div class="message-container">
            <p 
            v-bind:key="index"
            v-for="(message, index) in chat" 
            class="chat-message"
            >
                {{ message?.author }} - {{ message?.text }}
            </p>
        </div>
    <input v-model="messageModel.text" type="text" />
    <button @click="sendMessage">Send</button>
</div>

</template>

<style scoped>
    #chat-container {
        display: flex;
        flex-direction: column;
        margin-top: 50px;
        align-self: flex-end;
    }

    input {
        width: fit-content;
    }
    button {
        width: fit-content;
    }
    .message-container {
        display: flex;
        flex-direction: column;
    }
</style>