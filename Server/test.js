global.db = {hel:'ont'}

const fun = ({db})=>{
    db.gw = 'wrg'
}

fun({db})
require('./test_2')()
console.log(db)