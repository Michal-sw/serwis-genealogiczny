import { io } from 'socket.io-client';
import { useChatStore } from '../stores/chat';

export function createSocket() {
    const socket = io('http://127.0.0.1:8080');

    socket.on('chatHistory', data => {
        useChatStore().setHistory(data);
    })

    socket.on('message', data => {
        useChatStore().addMessage(data);
    });

    return socket;
}
