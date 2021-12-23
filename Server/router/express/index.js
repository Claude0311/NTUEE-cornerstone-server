const router = require('express').Router();
const cors = require('cors'); //cors

module.exports = ({ io, PORT })=>{
    /**
     * @api {get} /remain_time 剩餘時間
     * @apiGroup Express/GameInfo
     * @apiSuccess (200) {Number} time_remain 剩餘時間
     */
    router.get("/remain_time", (req, res) => {
        res.json({ time_remain: db.time_remaining });
    });
    /**
     * @api {get} /current_score 目前分數
     * @apiGroup Express/GameInfo
     * @apiSuccess (200) {Number} current_score 分數
     */
    router.get("/current_score", (req, res) => {
        res.json({ current_score: db.status.point });
    });
    /**
     * @api {get} /game_status 分數和時間
     * @apiGroup Express/GameInfo
     * @apiSuccess (200) {Number} time_remain 剩餘時間
     * @apiSuccess (200) {Number} current_score 分數
     */
    router.get("/game_status", (req, res) => {
        res.json({
            current_team: db.current_team,
            time_remain: db.time_remaining,
        });
    });
    /**
     * @api {get} /game_info 詳細資訊
     * @apiGroup Express/GameInfo
     * @apiSuccess (200) {Number} time_remain 剩餘時間
     * @apiSuccess (200) {Number} current_score 分數
     */
    router.get("/game_info", (req, res) => {
        res.json({
            ip: require('./getIP')(PORT),
            history: db.history,
            current_team: db.current_team,
            time_remaining: db.time_remaining,
            status: db.status,
            GAME_TIME: GAME_TIME,
        });
    });

    const whitelist = ['http://localhost:3000']
    const corsOptions = {
    origin:function  (origin, callback) {
        console.log('ori',origin)
        if (whitelist.indexOf(origin) !== -1) {
        callback(null, true)
        } else {
        callback(new Error('not in white list'))
        }
    }
    }

    /////////////// TA only ///////////////
    const isAdmin = (req,res,next)=>{
        if(
            req.socket.remoteAddress==='127.0.0.1' 
            || process.env.NODE_ENV !== "production" && req.query.pass==='taonly'
        ) next()
        else res.status(403).send('localhost only')
    }
    router.get("/reset", isAdmin, require('./reset')({io}))
    router.get("/modify_score",isAdmin, require('./modify_score')({io}))

    return router
}