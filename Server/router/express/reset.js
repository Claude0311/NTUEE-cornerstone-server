const fs = require("fs");
/**
 * @api {get} /reset 清除紀錄
 * @apiGroup Express/TA
 * @apiDescription 清除紀錄
 * 
 * @apiparam {String} token token from login
 * 
 * @apiSuccess (200) {String} message "reset_complete"/"reset_error"
 */
module.exports = ({io})=>(req,res) => {
    const toReset = {"0":{},"1":{}}
    fs.writeFile("./data/history.json",JSON.stringify(toReset),(err)=>{
        if(!err){
            console.log("reset_complete");
            res.json({message: "reset_complete"});
        }
        else{
            console.log(err);
            res.json({error: "reset_error"});
        }
    });
    db.history = toReset
    io.emit("modify_history_score", {
        history: db.history["0"],
    });
}