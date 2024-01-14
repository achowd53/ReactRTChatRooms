const { HashMap } = require("hashmap");
const { Server } = require("socket.io");
const { Worker, workerData } = require("worker_threads");

const axios = require("axios");
async function getServerHistory(server) {
    await axios({
            method: 'get',
            url: 'http://localhost:4000/api/getServerHistory?server='+server
        }).then((ret) => {
            return ret.data;
        });
};

var port_used = new Array(512);
port_used.fill(0);
var port_thread = new Array(512);
port_thread.fill(null);
var server_to_port = new HashMap();

var io = new Server(28000);
console.log("Server listening on port 28000");
io.on("connection", (socket) => {
    socket.on("data", (server_name) => {
        // Find first unused port number if server doesn't exist
        if (!server_to_port.has(server_name) || server_to_port.get(server_name)==-1) {
            for (i = 0; i < 64; i++) {
                if (!port_used[i]) {
                    port_used[i] = 1;
                    port_thread[i] = new Worker("./worker.js", { workerData: { port: i+28001, server: server_name } });
                    port_thread[i].on("message", (data) => {
                        port_used[i] = 0;
                        port_thread[i] = null;
                        server_to_port.delete(server_name);
                    });
                    server_to_port.set(server_name, i);
                    break;
                }
           }
        }
        console.log("Server", server_name, "listening on port", server_to_port.get(server_name)+28001);
        getServerHistory(server_name)
            .then((serverHistory) => {
                console.log(serverHistory);
                socket.emit("data", server_to_port.get(server_name)+28001, serverHistory);
            });
    });
});