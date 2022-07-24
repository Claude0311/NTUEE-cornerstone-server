const app = require("express")();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const next = require("next");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const PORT = 3000
const nextApp = next({ dev });
const nextHandler = nextApp.getRequestHandler();

// data
global.uids = require("./data/uid.json");
// const sequence = require("./data/sequence.json");
global.GAME_TIME = require("./data/time.json").GAME_TIME
global.db = require("./data/sample") // placeholder
db.history = JSON.parse(fs.readFileSync("./data/history.json", "utf-8"))
const keygen = require("keygenerator");
global.jwt_secret_key = keygen._()

// socket.io server
io.on("connection", (socket) => {
    console.log("connected");
    console.log("Connect time:", new Date().toString().slice(0, 24))
    // router
    require('./router/socket/index')({ socket, io })
});

// express server
nextApp.prepare().then(() => {
    //router
    app.use(require('./router/express/index')({ io, PORT }))

    app.get('/test',(req,res)=>{res.send('hello')})
    
    app.get("*", (req, res) => {
        return nextHandler(req, res);
    });

    server.listen(PORT,'0.0.0.0', (err) => {
        if (err) throw err;
        console.log('dev',dev)
        console.log(`> Ready on http://localhost:${PORT}`);
    });
});
