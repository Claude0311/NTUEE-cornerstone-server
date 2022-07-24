const fs = require("fs")

module.exports = ({io})=>{
    return async (req, res) => {
        const time = parseInt(req.query.time)
        if(!time) return
        GAME_TIME = time
        fs.writeFile("./data/time.json",JSON.stringify({GAME_TIME}),(err)=>{
            if(err) return res.status(403).json( {msg: "success"} );
            io.emit("modify_time",{GAME_TIME})
        })
        const n = ['undefined',undefined,null,'null']
        if (!n.includes(req.query.team) && !n.includes(req.query.new_score)) {
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
            res.status(200).json( {msg: "success"} );
        }
        // an id and score is given -> modify current game score
        else if (!n.includes(req.query.id) && !n.includes(req.query.new_score)) {
            const team = db.current.find(({id})=>id===req.query.id)
            team.status.point = parseInt(req.query.new_score);
            res.status(201).json( {msg: "success", new_score: team.status.point} );
            io.emit("modify_current_score", {
                id: team.id,
                point: team.status.point,
            });
            console.log(`Score modified to ${team.status.point}`)
            db.current = db.current.map(data => data.id === team.id ? team : data)
        }
        // other conditions -> error
        else {
            res.status(202).json( {msg: "error", error: "game is not active."} )
        }
    }
}