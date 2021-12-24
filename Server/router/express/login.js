const SHA256 = require("crypto-js/sha256")

module.exports.login = (req,res)=>{
    const password = req.query.pass
    const secure_pass = SHA256(password).toString();
    console.log('login fail =',secure_pass!=='7c344f977d4878c0f7a8f115eac7f19af82642917c55cc686b777a829ba0c1f2')
    if (secure_pass!=='7c344f977d4878c0f7a8f115eac7f19af82642917c55cc686b777a829ba0c1f2') return res.status(404).send('wrong password')
    req.session.isLogin = true
    res.send('login success')
}

module.exports.logout = (req,res)=>{
    req.session.destroy(err=>{
        if(err) return res.status(404).send('logout fail')
        res.send('logout success')
    })
}

module.exports.isLogin = (req,res,next)=>{
    console.log('isLogin',req.session.isLogin)
    if(
        req.session.isLogin
        || process.env.NODE_ENV !== "production"
    ) return next()
    return res.status(403).send('not login')
}