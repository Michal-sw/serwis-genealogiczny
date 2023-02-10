import { Socket, Server } from 'socket.io';

export const createWebsocketServer = (server) => {
    const io: Server = require('socket.io')(server);

    io.sockets.on("connection", (socket: Socket) => {
        console.log("*** Socket active ***");
        socket.emit("message", "Hello!");

        socket.on("message", data => {
            console.log(data);
        });

        socket.emit("connected", "Hello");
    });

    io.listen(8081);
}  
