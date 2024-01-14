const { HashMap } = require("hashmap");
const { Server } = require("socket.io");
const { Worker, workerData } = require("worker_threads");

// TODO: Implement atomic switch to kill all threads

var port_used = new Array(64);
port_used.fill(0);
var port_thread = new Array(64);
port_thread.fill(null);
var server_to_port = new HashMap();

var io = new Server(28000);
console.log("Server listening on port 28000");
io.on("connection", (socket) => {
    console.log("A user has connected");
    socket.on("data", (data) => {
        const [username, server_name] = data.split(' ');
        console.log(username," ",server_name);
        // Find first unused port number if server doesn't exist
        if (!server_to_port.has(server_name) || server_to_port.get(server_name)==-1) {
            for (i = 0; i < 64; i++) {
                if (!port_used[i]) {
                    console.log("Thread on port_num",i,"created");
                    port_used[i] = 1;
                    port_thread[i] = new Worker("./worker.js", { workerData: { port: i+28001 } });
                    port_thread[i].on("message", (data) => {
                        port_used[i] = 0;
                        port_thread[i] = null;
                        server_to_port.set(server_name, -1);
                        console.log("Thread on port_num",i,"destroyed");
                    });
                    server_to_port.set(server_name, i);
                    break;
                }
           }
        }
        socket.emit("data", server_to_port.get(server_name)+28001);
    });
});

// Step 5: Thread run server with users:socket hashmap, 
//         that accepts input and sends to all users
// Step 5.1: Close all threads on end of server
// Step 5.2: Close all sockets on each thread
// Step 6: PostgreSQL update