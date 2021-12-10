const fs = require("fs")
module.exports = ({io})=>{
    return (req, res) => {
        // a team and score is given -> modify history
        if (req.query.team != null && req.query.new_score != null) {
            db.history["0"][req.query.team]["point"] = req.query.new_score
            io.emit("modify_history_score", {
                history: db.history["0"],
            });
            fs.writeFile("../../data/history.json", JSON.stringify(db.history), (err) => {
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
    }
}