const SHA256 = require("crypto-js/sha256")
const jwt = require("jsonwebtoken")

module.exports.login = (req,res)=>{
    const password = req.body.pass
    const secure_pass = SHA256(password).toString();
    console.log('login fail =',secure_pass!=='7c344f977d4878c0f7a8f115eac7f19af82642917c55cc686b777a829ba0c1f2')
    if (secure_pass!=='7c344f977d4878c0f7a8f115eac7f19af82642917c55cc686b777a829ba0c1f2') return res.status(404).send('wrong password')
    const token = jwt.sign({ password }, jwt_secret_key, {expiresIn: '1d'})
    res.json({token})
}

module.exports.isLogin = (req,res,next)=>{
    const token = req.query.token || req.cookies.token
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
        if(
            err
            //  && process.env.NODE_ENV === "production"
        ) return res.status(403).send('not login')
        req.acc_token = token
        next()
    })
}