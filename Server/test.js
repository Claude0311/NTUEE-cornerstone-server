const SHA256 = require("crypto-js/sha256")
const password = "" //type your password
console.log(SHA256(password).toString())

const creatInt = (bol=true)=>{
    let vary = 10
    const cf = setInterval(()=>{
        if(bol){

            vary = vary - 1;
        }else{
            vary = vary - 2;
        }
        console.log(vary)
        if(vary<0){
            clearInterval(cf)
        }
    },1000)
}
creatInt()
creatInt(false)