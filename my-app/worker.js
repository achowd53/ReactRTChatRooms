const { parentPort, workerData } = require('worker_threads');

var users = new Array();
var max_users = 0;
// Thread dies once a user has joined and no one left in 
if (max_users > 0 & users.length == 0) {
    parentPort.postMessage("thread dead");
    return;
}