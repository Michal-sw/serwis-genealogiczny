// const serverUrl = "ws://127.0.0.1:8080";

export function createSocket() {
    console.log("Creating socket");
    const socket = new WebSocket('wss://echo.websocket.org');

    console.log()
    socket.onopen = (event) => {
        console.log(event);
        console.log("Connected");
    }

    socket.onmessage = (event) => {
        console.log(event);
        console.log("Message!");
    }

    socket.addEventListener('open', _event => {
        console.log("Open");
    })

    socket.addEventListener('connection', _event => {
        console.log("Open");
    })

    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
    });

    return socket;
}
