const fs = require("fs")
/**
 * @api {get} /modify_score 修改分數
 * @apiGroup Express/TA
 * @apiDescription 修改分數
 * 
 * @apiparam {String} team 隊名(未指定則修改當前分數)
 * @apiparam {String} new_score 新分數
 * 
 * @apiSuccess (200) {String} msg "success"
 * @apiSuccess (200) {Number} new_score 新分數
 * @apiSuccess (200) {Socket} Socket.emit.modify_history_score {history}
 * 
 * @apiSuccess (201) {String} msg "success"
 * @apiSuccess (201) {Number} new_score 新分數
 * @apiSuccess (201) {Socket} Socket.emit.modify_current_score {point}
 * 
 * @apiSuccess (202) {String} msg "error"
 * @apiSuccess (202) {String} error "game is not active."
 */
module.exports = ({io})=>{
    return (req, res) => {
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
            res.status(200).json( {msg: "success", new_score: db.status.point} );
        }
        // only a score is given -> modify current game score
        else if (db.current_team != null && req.query.new_score != null) {
            db.status.point = parseInt(req.query.new_score);
            res.status(201).json( {msg: "success", new_score: db.status.point} );
            io.emit("modify_current_score", {
                point: db.status.point,
            });
            console.log(`Score modified to ${db.status.point}`)
        }
        // other conditions -> error
        else {
            res.status(202).json( {msg: "error", error: "game is not active."} )
        }
    }
}