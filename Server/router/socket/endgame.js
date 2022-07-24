// endgame function
const fs = require("fs");
/**
 * @api {socket} stop_game 結束遊戲
 * @apiGroup Socket
 * @apiDescription 結束遊戲
 * 
 * @apiSuccess {Socket.emit} game_end 
 * @apiSuccess {Socket.broadcast} game_end {history, gamemode}
 */
module.exports = endgame = ({socket,io,id:taid}) => {
    const team = db.current.find(({id})=>(id===socket.id)||(id===taid))
    if(team===undefined) return console.log('stop game id not found')
    clearInterval(team.cur_game_countdown);
    console.log("game ended");
    console.log(
        `Team ${team.current_team} got ${team.status.point} points at game${team.status.gamemode}.`
    );
    // update database in memory with the current game
    if (
        !db.history[team.status.gamemode][team.current_team] ||
        db.history[team.status.gamemode][team.current_team].point < team.status.point ||
        (db.history[team.status.gamemode][team.current_team].point == team.status.point &&
        db.history[team.status.gamemode][team.current_team].last_eaten_time < team.status.last_eaten_time)
    ) {
        db.history[team.status.gamemode][team.current_team] = {
            point: team.status.point,
            last_eaten_time: team.status.last_eaten_time,
            time: new Date().toString().slice(0, 24),
        };
    }
    // broadcast "game_end" for clients to disconnect
    console.log(`gamemode ${team.status.gamemode}`)
    io.emit("game_end", {
        id: team.id,
        history: db.history[team.status.gamemode],
        gamemode: team.status.gamemode,
    });
    // reset the active game status
    db.current = db.current.filter(({id})=>id!==team.id)
    // write database from memory into file ('./data/history.json)
    fs.writeFile("./data/history.json", JSON.stringify(db.history), (err) => {
        if (err) {
            console.log("history write error");
        } else {
            console.log("history filewrite complete");
        }
    });
}