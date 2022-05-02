const SHA256 = require("crypto-js/sha256")
const jwt = require("jsonwebtoken")

module.exports.login = (req,res)=>{
    const password = req.body.pass
    const secure_pass = SHA256(password).toString();
    console.log('login fail =',secure_pass!=='45d227c4b297a0ba4ce42738ad3d448e19628a5ecfd509ea861b24a23009d08e')
    if (secure_pass!=='45d227c4b297a0ba4ce42738ad3d448e19628a5ecfd509ea861b24a23009d08e') return res.status(404).send('wrong password')
    const token = jwt.sign({ password }, jwt_secret_key, {expiresIn: '1d'})
    res.json({token})
}

require('dotenv').config()
module.exports.isLogin = (req,res,next)=>{
    const token = req.query.token || req.cookies.token
    jwt.verify(token, jwt_secret_key, (err, decoded) => {
        if(
            err
             && process.env.forstu !== "y"
        ) return res.status(403).send('not login')
        req.acc_token = token
        next()
    })
}