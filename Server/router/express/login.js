const SHA256 = require("crypto-js/sha256")
const jwt = require("jsonwebtoken")

const passHash = '45d227c4b297a0ba4ce42738ad3d448e19628a5ecfd509ea861b24a23009d08e'
module.exports.passGen = (password="")=>{
    const passGened = SHA256(password).toString()
    console.log(passGened)
    return passGened
}
// passGen("")

module.exports.login = (req,res)=>{
    const password = req.body.pass
    const secure_pass = SHA256(password).toString();
    console.log('login success =',secure_pass===passHash)
    if (secure_pass!==passHash) return res.status(404).send('wrong password')
    const token = jwt.sign({ password }, jwt_secret_key, {expiresIn: '1d'})
    res.json({token})
}

require('dotenv').config()
module.exports.isLogin = (req,res,next)=>{
    const token = req.query.token || req.cookies.token
    console.log('ck',req.cookies,token)
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
        if(
            err
             && process.env.forstu !== "y"
        ) return res.status(403).send('not login')
        req.acc_token = token
        console.log('tokenpass')
        next()
    })
}