const router = require('express').Router()
const router_admin = require('express').Router()
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require("cookie-parser")

module.exports = ({ io, PORT })=>{
    router.use(bodyParser.urlencoded({ extended: true }))
	router.use(bodyParser.json())
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
            ip: require('./get_ip')(PORT),
            history: db.history,
            current_team: db.current_team,
            time_remaining: db.time_remaining,
            status: db.status,
            GAME_TIME: GAME_TIME,
        });
    });

    /////////////// session control ///////////////
    const {isLogin, login} = require('./login')
    
    router_admin.use(cors())
    router_admin.use(cookieParser())
    router_admin.post('/login',login)
    router_admin.get('/isLogin',isLogin,(req,res)=>{
        const token = req.acc_token
        res.json({token})
    })

    /////////////// TA only ///////////////
    router_admin.use(isLogin)
    router_admin.get("/reset", require('./reset')({io}))
    router_admin.get("/modify_score", require('./modify_score')({io}))

    router.use('/ta',router_admin)

    return router
}