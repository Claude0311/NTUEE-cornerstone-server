const jwt = require("jsonwebtoken")
require('dotenv').config()

module.exports = ({socket,uids,io})=>{
    socket.on("add_UID", require('./add_uid')({uids,socket}))
    // on "start_game"
    socket.on("start_game", require('./start_game')({uids,socket,io}))
    // on "stop_game"
    socket.on("stop_game", ({token})=>{
        try{
            jwt.verify(token, jwt_secret_key, (err, decoded) => {
                if(
                    err
                     && process.env.forstu !== "y"
                ) return
                require('./endgame')({socket,io})
            })
        }catch{
            console.log('err')
        }
    })
}