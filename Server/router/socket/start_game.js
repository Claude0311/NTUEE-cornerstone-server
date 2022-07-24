const endgame = require('./endgame')

/**
 * @api {socket} start_game 開始遊戲
 * @apiGroup Socket
 * @apiDescription 開始遊戲，之後每秒emit update_time
 * 
 * @apiparam {String} gamemode default 0
 * @apiparam {String} team 隊名
 * 
 * @apisuccess (success)  {Socket.emit} game_started {current_team,gamemode}
 * @apisuccess (every second)  {Socket.broadcast.emit} update_time {time_remain}
 * @apiSuccess (times up)  {Socket.emit} game_end 
 * @apiSuccess (times up) {Socket.broadcast} game_end {history, gamemode}
 * @apisuccess (fail)  {Socket.emit} game_already_started {time_remain}
 */
module.exports = ({io, socket})=>{
    return (data) => {
        if(db.current.some(({current_team})=>current_team===data.team)){
            const {time_remaining:time_remain} = db.current.find(({current_team})=>current_team===data.team)
            socket.emit("game_already_started", {time_remain})
            return
        }
        const newMem = {
            id: socket.id,
            current_team: data.team,
            time_remaining: GAME_TIME,
            status: {
                gamemode: data.gamemode===undefined?0:data.gamemode,
                //point of current team
                point: 0,
                last_eaten_time: 0,
            },
            cur_game_countdown: null,
            visited: {},
        }
        // broadcast "game_started" to start game
        io.emit("game_started", {
            id: socket.id,
            current_team: newMem.current_team,
            gamemode: 0,
        });
        console.log("start game");
        console.log("Start time:", new Date().toString().slice(0, 24));
        console.log("Current team:", data.team);
        console.log("Game mode:", data.gamemode);
        // set the countdown timer
        newMem.cur_game_countdown = setInterval(() => {
            const team = db.current.find(({id})=>id===socket.id)
            if (team.time_remaining > 0) {
                team.time_remaining = team.time_remaining - 1;
                if (team.time_remaining % 10 === 0) {
                    socket.broadcast.emit("update_time", {
                        id: socket.id,
                        time_remain: team.time_remaining,
                    })
                }
                db.current = db.current.map(data => data.id===socket.id ? team : data)
            } else {
                endgame({io,socket})
            }
        }, 1000)
        db.current.push(newMem)
    }
}
// const oldfunc = (data) => {
//     // is there an active game?
//     // yes
//     if (!db.cur_game_countdown && !db.current_team) {
//         db.status.gamemode = data.gamemode===undefined?0:data.gamemode;
//         db.current_team = data.team;
//         // broadcast "game_started" to start game
//         io.emit("game_started", {
//             current_team: db.current_team,
//             gamemode: db.status.gamemode,
//         });
//         console.log("start game");
//         console.log("Start time:", new Date().toString().slice(0, 24));
//         console.log("Current team:", data.team);
//         console.log("Game mode:", data.gamemode);
//         // set the countdown timer
//         db.cur_game_countdown = setInterval(() => {
//             if (db.time_remaining > 0) {
//                 db.time_remaining = db.time_remaining - 1;
//                 if (db.time_remaining % 10 === 0) {
//                     socket.broadcast.emit("update_time", {
//                         time_remain: db.time_remaining,
//                     });
//                 }
//             } else {
//                 endgame({io,socket});
//             }
//         }, 1000);
//     }
//     // a game is running
//     else {
//         socket.emit("game_already_started", {
//             time_remain: db.time_remaining,
//         });
//     }
// }
// }