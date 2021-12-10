const fs = require("fs");
module.exports = (req,res) => {
    if(req.query.pass === "taonly"){
        fs.writeFile("../../data/history.json",JSON.stringify({"0":{},"1":{}}),(err)=>{
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
}