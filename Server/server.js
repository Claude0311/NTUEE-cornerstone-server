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

// Create database placeholder
const db = {
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
db.history = JSON.parse(fs.readFileSync("./data/history.json", "utf-8"));

// SOCKET

// endgame function
function endgame(socket) {
    clearInterval(db.cur_game_countdown);
    console.log("game ended");
    console.log(
        `Team ${db.current_team} got ${db.status.point} points at game${db.status.gamemode}.`
    );
    // update database in memory with the current game
    if (
        !db.history[db.status.gamemode][db.current_team] ||
        db.history[db.status.gamemode][db.current_team].point <
            db.status.point ||
        (db.history[db.status.gamemode][db.current_team].point ==
            db.status.point &&
            db.history[db.status.gamemode][db.current_team].last_eaten_time <
                db.status.point)
    ) {
        db.history[db.status.gamemode][db.current_team] = {
            point: db.status.point,
            last_eaten_time: db.status.last_eaten_time,
            time: new Date().toString().slice(0, 24),
        };
    }
    // broadcast "game_end" for clients to disconnect
    socket.broadcast.emit("game_end", {
        history: db.history[db.status.gamemode],
        gamemode: db.status.gamemode,
    });
    socket.emit("game_end");
    // reset the active game status
    db.current_team = null;
    db.cur_game_countdown = null;
    db.last_eaten_time = 0;
    db.time_remaining = GAME_TIME;
    db.status.gamemode = null;
    db.status.point = 0;
    db.status.current_sequence_index = 0;
    db.status.last_eaten_time = GAME_TIME;
    db.visited = {};
    // write database from memory into file ('./data/history.json)
    fs.writeFile("./data/history.json", JSON.stringify(db.history), (err) => {
        if (err) {
            console.log("history write error");
        } else {
            console.log("history filewrite complete");
        }
    });
}

// socket.io server
io.on("connection", (socket) => {
    console.log("connected");
    console.log("Connect time:", new Date().toString().slice(0, 24));
    // on "add_UID"
    socket.on("add_UID", (data) => {
        console.log("UID:",data.uid_str);
        //convert to upper case
        data.uid_str = data.uid_str.toUpperCase();
        // UID not found
        if (!uids[data.uid_str]) {
            socket.emit("UID_added", "uid not found.");
        } 
        // UID already visited
        else if (db.visited[data.uid_str]) {
            socket.emit("UID_added", "uid already visited.");
        } 
        // new valid UID
        else {
            db.status.point += uids[data.uid_str];
            db.status.last_eaten_time = db.time_remaining;
            db.visited[data.uid_str] = true;
            socket.emit(
                "UID_added",
                `Added ${uids[data.uid_str]} points at ${
                    db.time_remaining
                } seconds left.`
            );
            socket.broadcast.emit("UID_added", { point: db.status.point });
            console.log(
                `Added ${uids[data.uid_str]} points at ${
                    db.time_remaining
                } seconds left.`
            );
        }
    });
    // on "start_game"
    socket.on("start_game", (data) => {
        // is there an active game?
        // yes
        if (!db.cur_game_countdown && !db.current_team) {
            db.status.gamemode = data.gamemode;
            db.current_team = data.team;
            // broadcast "game_started" to start game
            io.emit("game_started", {
                current_team: db.current_team,
                gamemode: db.status.gamemode,
            });
            console.log("start game");
            console.log("Start time:", new Date().toString().slice(0, 24));
            console.log("Current team:", data.team);
            console.log("Game mode:", data.gamemode);
            // set the countdown timer
            db.cur_game_countdown = setInterval(() => {
                if (db.time_remaining > 0) {
                    db.time_remaining = db.time_remaining - 1;
                    if (db.time_remaining % 10 === 0) {
                        socket.broadcast.emit("update_time", {
                            time_remain: db.time_remaining,
                        });
                    }
                } else {
                    endgame(socket);
                }
            }, 1000);
        }
        // a game is running
        else {
            socket.emit("game_already_started", {
                time_remain: db.time_remaining,
            });
        }
    });
    // on "stop_game"
    socket.on("stop_game", () => {
        endgame(socket);
    });
});

// route the URL
// REST API functions for the server
nextApp.prepare().then(() => {
    app.get("/remain_time", (req, res) => {
        res.json({ time_remain: db.time_remaining });
    });
    app.get("/current_score", (req, res) => {
        res.json({ current_score: db.status.point });
    });
    //for python client
    app.get("/game_status", (req, res) => {
        res.json({
            current_team: db.current_team,
            time_remain: db.time_remaining,
        });
    });
    //for nextjs client
    app.get("/game_info", (req, res) => {
        res.json({
            history: db.history,
            current_team: db.current_team,
            time_remaining: db.time_remaining,
            status: db.status,
            GAME_TIME: GAME_TIME,
        });
    });
    app.get("/reset", (req,res) => {
	if(req.query.pass === "taonly"){
		fs.writeFile("./data/history.json",JSON.stringify({"0":{},"1":{}}),(err)=>{
			if(!err){
				console.log("reset_complete");
				res.json({message: "reset_complete"});
			}
			else{
				console.log(err);
				res.json({error: "reset_error"});
			}
		});
		db.history = {"0":{},"1":{}};
	}
    });
    // for TA to modify score
    app.get("/modify_score", (req, res) => {
        // a team and score is given -> modify history
        if (req.query.team != null && req.query.new_score != null) {
            db.history["0"][req.query.team]["point"] = req.query.new_score
            io.emit("modify_history_score", {
                history: db.history["0"],
            });
            fs.writeFile("./data/history.json", JSON.stringify(db.history), (err) => {
                if (err) {
                    console.log("history write error");
                } else {
                    console.log("history filewrite complete");
                }
            });
            res.json( {msg: "success", new_score: db.status.point} );
        }
        // only a score is given -> modify current game score
        else if (db.current_team != null && req.query.new_score != null) {
            db.status.point = parseInt(req.query.new_score);
            res.json( {msg: "success", new_score: db.status.point} );
            io.emit("modify_current_score", {
                point: db.status.point,
            });
            console.log(`Score modified to ${db.status.point}`)
        }
        // other conditions -> error
        else {
            res.json( {msg: "error", error: "game is not active."} )
        }
    });

    app.get("*", (req, res) => {
        return nextHandler(req, res);
    });

    server.listen(3000, (err) => {
        if (err) throw err;
        console.log("> Ready on http://localhost:3000");
    });
});
