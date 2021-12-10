const router = require('express').Router();


module.exports = ({GAME_TIME,io})=>{
    router.get("/remain_time", (req, res) => {
        res.json({ time_remain: db.time_remaining });
    });
    router.get("/current_score", (req, res) => {
        res.json({ current_score: db.status.point });
    });
    //for python client
    router.get("/game_status", (req, res) => {
        res.json({
            current_team: db.current_team,
            time_remain: db.time_remaining,
        });
    });
    //for nextjs client
    router.get("/game_info", (req, res) => {
        res.json({
            ip: require('./getIP')(),
            history: db.history,
            current_team: db.current_team,
            time_remaining: db.time_remaining,
            status: db.status,
            GAME_TIME: GAME_TIME,
        });
    });
    router.get("/reset", require('./reset'))
    // for TA to modify score
    router.get("/modify_score", require('./modify_score')({io}));

    return router
}