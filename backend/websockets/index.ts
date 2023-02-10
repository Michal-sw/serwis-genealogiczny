import { Socket, Server } from 'socket.io';

export const createWebsocketServer = (server) => {
    const io: Server = require('socket.io')(server, {
        cors: {
            origin: "http://127.0.0.1:5173"
        }
    });

    io.on('connection', (socket) => {
        io.emit('message', {
            text: "New user has joined the chat!"
        });

        socket.on('message', async data => {
            io.emit('message', data)
        })
    })
    io.listen(8081);
}  
