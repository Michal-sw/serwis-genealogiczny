import { Server, Socket } from "socket.io";

export const createWebsocketServer = (server) => {
    const io = new Server({ ...server });

    io.on("connection", (socket: Socket) => {
        console.log("*** Socket active ***");

        socket.on("message", data => {
            console.log(data);
        });

        socket.emit("connected", "Hello");
    });
}  
