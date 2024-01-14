// Create pool and table
const Pool = require('pg').Pool;
const pool = new Pool({
    host     : 'localhost',
    user     : 'postgres',
    password : 'abc123',
    database : 'postgres',
    port: '5432'
});

// API Calls
async function getServerHistory(server) {
    try {
        await pool.query("CREATE TABLE IF NOT EXISTS chatrooms(server text NOT NULL, username text NOT NULL, datetime text NOT NULL, message text NOT NULL);");
        let generateHistory = await pool
            .query("SELECT datetime, username, message FROM chatrooms WHERE server = $1 ORDER BY datetime ASC", [server]);
        return generateHistory.rows;
    } catch (error){
        console.log(error);
    }
}

async function addServerHistory(data) {
    try {
        let addHistory = await pool
            .query("INSERT into chatrooms (server, username, datetime, message) VALUES ($1, $2, $3, $4)", [data.server, data.username, data.datetime, data.message]);
        return "Successfully added entry to database";
    } catch (error) {
        console.log(error);
    } 
}

// Set up API server
const express = require('express');
const app = express();
const router = express.Router();
app.use(express.json());
app.use('/api', router);
router.route('/getServerHistory').get((req, res) => {
    const server = req.query.server;
    getServerHistory(server).then((result) => {
        return res.json(result);
    })
});
router.route('/addServerHistory').post((req, res) => {
    let data = {...req.body};
    addServerHistory(data).then((result) => {
        return res.status(200).json(result);
    });
});

const port = 4000;
app.listen(port, () => {
    console.log("Server running on port", port)
})