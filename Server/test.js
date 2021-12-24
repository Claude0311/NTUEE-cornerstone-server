// const n = ['undefined',undefined,null,'null']
// const n2 = ['wgr','gewouirh']
// const u = '0'
// console.log(u in n2)
// for(let i in n){
//     console.log(i)
// }

// n.forEach(ele=>{
//     console.log(ele)
//     console.log(ele==='0')
//     console.log('0'==ele)
// })

const PORT=3000
const nets = require('os').networkInterfaces()
const results = {}
for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(`http://${net.address}:${PORT}`);
        }
    }
}
console.log(results)
// return results