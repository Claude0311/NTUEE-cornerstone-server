const fs = require("fs")

module.exports.modify_time = ({io})=>{
    return async (req, res) => {
        const time = parseInt(req.query.time)
        if(!time) return res.status(400).json( {msg: "invalid type"} );
        fs.writeFile("./data/time.json",JSON.stringify({GAME_TIME:time}),(err)=>{
            if(err) return res.status(503).json( {msg: "store file error"} )
            GAME_TIME = time
            io.emit("modify_time",{GAME_TIME})
        })
    }
}

module.exports.getUIDs = ()=>{
    return async (req,res)=>{
        res.status(200).json( uids )
    }
}

module.exports.setUIDs = ()=>{
    return async (req,res)=>{
        let newuids = {}
        try{
            newuids = JSON.parse(req.query.uids)
        }catch{
            return res.status(400).json( {msg: "invalid type"} );
        }
        fs.writeFile("./data/uid.json",req.query.uids,(err)=>{
            if(err) return res.status(503).json( {msg: "store file error"} )
            uids = newuids
            res.status(200).json( {msg: "done"} );
        })
    }
}