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