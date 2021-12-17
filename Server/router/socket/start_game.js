const endgame = require('./endgame')

/**
 * @api {socket} start_game 開始遊戲
 * @apiGroup Socket
 * @apiDescription 開始遊戲，之後每秒emit update_time
 * 
 * @apiparam {String} gamemode (optional)
 * @apiparam {String} team 隊名
 * 
 * @apisuccess (success)  {Socket.emit} game_started {current_team,gamemode}
 * @apisuccess (fail)  {Socket.emit} game_already_started {time_remain}
 */
module.exports = ({io, socket})=>{
    return (data) => {
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
    }
}