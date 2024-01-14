const { HashMap } = require("hashmap");
const { Server } = require("socket.io");
const { parentPort, workerData } = require('worker_threads');

var users = new HashMap();
var sockets = new HashMap();

var io = new Server(workerData.port);
console.log("Server listening on port", workerData.port);
io.on("connection", (socket) => {
    socket.on("uuid", (user) => {
        if (!users.has(user) || users.get(user)==null) {
            console.log("User", user, "listening on port", workerData.port);
            users.set(user, socket);
            sockets.set(socket, user);
        } else {
            users.set(user, socket);
            sockets.set(socket, user);
        }
    });
    socket.on('data', (data) => {
        console.log("Received message from clients", data);
        users.values().forEach((sock) => {
            sock.emit("data", data);
        });
    });
    socket.on('error', (err) => {
        console.log(err);
    });
});
io.on("disconnect", (socket) => {
    users.delete(sockets.get(socket));
    sockets.delete(socket);
    socket.disconnect();
    if (users.size == 0) {
        parentPort.postMessage("thread dead");
        io.close();
        return;
    }
});