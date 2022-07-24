const fs = require("fs")
/**
 * @api {get} /modify_score 修改分數
 * @apiGroup Express/TA
 * @apiDescription 修改分數
 * 
 * @apiparam {String} [team] 隊名(未指定則修改當前分數)
 * @apiparam {String} new_score 新分數
 * @apiparam {String} token token from login
 * 
 * @apiSuccess (team given) {String} msg "success"
 * @apiSuccess (team given) {Number} new_score 新分數
 * @apiSuccess (team given) {Socket.emit} modify_history_score {history}
 * 
 * @apiSuccess (team not given) {String} msg "success"
 * @apiSuccess (team not given) {Number} new_score 新分數
 * @apiSuccess (team not given) {Socket.emit} modify_current_score {point}
 * 
 * @apiSuccess (game not start) {String} msg "error"
 * @apiSuccess (game not start) {String} error "game is not active."
 */
module.exports = ({io})=>{
    return async (req, res) => {
        // a team and score is given -> modify history
        const score = parseInt(req.query.new_score)
        if(!score) return res.status(400).json( {msg: "invalid type"} );
        const n = ['undefined',undefined,null,'null']
        if (!n.includes(req.query.team)) {
            db.history["0"][req.query.team]["point"] = score
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
            res.status(200).json( {msg: "success"} );
        }
        // an id and score is given -> modify current game score
        else if (!n.includes(req.query.id)) {
            const team = db.current.find(({id})=>id===req.query.id)
            team.status.point = score
            res.status(201).json( {msg: "success", new_score: score} );
            io.emit("modify_current_score", {
                id: team.id,
                point: score,
            });
            console.log(`Score modified to ${score}`)
            db.current = db.current.map(data => data.id === team.id ? team : data)
        }
        // other conditions -> error
        else {
            res.status(202).json( {msg: "error", error: "game is not active."} )
        }
    }
}