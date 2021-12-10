const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

//uids
const uids = require("./data/uid.json");
const sequence = require("./data/sequence.json");
const GAME_TIME = 120;
// DATABASE
const PORT = 3000

// Create database placeholder
global.db = {
    history: {
        0: {
            //time format: Mon May 18 2020 15:47:16
            // "Team 1": {
            //     point: 100,
            //     last_eaten_time: 0,
            //     time: new Date().toString().slice(0, 24),
            // },
            // "Team 2": {
            //     point: 50,
            //     last_eaten_time: 0,
            //     time: new Date().toString().slice(0, 24),
            // },
            // "Team 3": {
            //     point: 10,
            //     last_eaten_time: 0,
            //     time: new Date().toString().slice(0, 24),
            // },
        },
        1: {
            // Legacy game 2, 2020 version
        },
    },

    // Current game data
    current_team: null,
    time_remaining: GAME_TIME,
    status: {
        gamemode: null,
        //point of current team
        point: 0,
        current_sequence_index: 0,
        last_eaten_time: 0,
    },
    cur_game_countdown: null,
    visited: {},
};

// read database ('./data/history.json') into program memory
db.history = JSON.parse(fs.readFileSync("./data/history.json", "utf-8"))

// SOCKET
// socket.io server
io.on("connection", (socket) => {
    console.log("connected");
    console.log("Connect time:", new Date().toString().slice(0, 24))
    // on "add_UID"
    require('./router/socket/index')({socket,uids})
});

// route the URL
// REST API functions for the server
nextApp.prepare().then(() => {
    app.use(require('./router/express/index')({GAME_TIME,io}))
    
    app.get("*", (req, res) => {
        return nextHandler(req, res);
    });

    server.listen(PORT,'0.0.0.0', (err) => {
        if (err) throw err;
        console.log(`> Ready on http://localhost:${PORT}`);
    });
});
