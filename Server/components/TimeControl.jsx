import React, { useEffect, useState } from "react";
import { ButtonGroup, Button, Input } from "reactstrap";
// import fetch from "isomorphic-fetch";
import { useSelector } from "react-redux";
import JSONInput from 'react-json-editor-ajrm';
import locale    from 'react-json-editor-ajrm/locale/en';

const Time = ({GAME_TIME,setModUID, modUID})=>{
    const ip = useSelector(state=>state.ip)
    const token = useSelector(state=>state.token)
    
    const onEdit = ({time})=>{
        fetch(`${ip}/ta/modify_time?time=${time}&token=${token}`)
        .then(res => {
            if(!res.ok) {
                setTime(GAME_TIME)
                return res.text().then(text => { throw new Error(text) })
            }
            else {
                return res.json();
            }
        })
        .catch(err => {
            console.log('Err:',err);
        });
    }
    const [modifying, setMod] = useState(false)
    const [newTime,setTime] = useState(GAME_TIME)
    useEffect(()=>{setTime(GAME_TIME)},[GAME_TIME])
    const ok = ()=>{
        setMod(false)
        onEdit({time:newTime})
    }
    const handleKeyPress = (target)=> {
        if(target.charCode==13){
          ok()
        }
    }
    if(modifying){
        return <div style={{display: "flex"}}>
        <h3>比賽時間: </h3>
        <div style={{width:"25%"}}>
            <Input
                value={newTime} onKeyPress={handleKeyPress}
                onChange={(e)=>{setTime(e.target.value)}} 
            />
        </div>
        <h3>秒{' '}</h3>
        <ButtonGroup>
            <Button  color="warning" onClick={ok}>
                ok
            </Button>
            <Button  color="warning" onClick={()=>setMod(false)}>
                cancel
            </Button>
        </ButtonGroup>
        </div>
    }else{
        return <h2>
            比賽時間: {Math.floor(newTime / 60)} 分 {newTime - Math.floor(newTime / 60) * 60} 秒{' '}
            <ButtonGroup>
                <Button  color="warning" onClick={()=>{setMod(true)}}>
                    edit Time
                </Button>
                {!modUID && 
                <Button  color="warning" onClick={()=>{
                    setModUID(true)
                }}>
                    edit UIDs
                </Button>
                }
            </ButtonGroup>
        </h2>
    }
}

const UIDs = ({setModUID})=>{
    const ip = useSelector(state=>state.ip)
    const token = useSelector(state=>state.token)
    const [uid,setUid] = useState({})
    const [able,setAble] = useState(true)
    const [errmsg,setMsg] = useState("")
    const onEdit = ()=>{
        fetch(`${ip}/ta/modify_uids?uids=${JSON.stringify(uid)}&token=${token}`).then(res => {
            if(!res.ok) {
                return res.text().then(text => { throw new Error(text) })
            }
            else {
                setModUID(false)
                return res.json();
            }
        })
        .catch(err => {
            setMsg('error occur')
            console.log('Err:',err);
        });
    }
    const ok = ()=>{
        if(!able) return
        onEdit()
    }
    useEffect(()=>{
        fetch(`${ip}/ta/uids?token=${token}`).then(async data=>{
            const d = await data.json()
            setUid(d)
        })
    },[])
    return <>
    <ButtonGroup>
        <Button  color="warning" onClick={ok} disabled={!able}>
            ok
        </Button>
        <Button  color="warning" onClick={()=>setModUID(false)}>
            cancel
        </Button>
    </ButtonGroup>
    {errmsg}
    <JSONInput
        placeholder = { uid }
        locale      = { locale }
        height      = 'auto'
        onChange={({plainText,error,jsObject})=>{
            // console.log(plainText)
            if(error) {
                setAble(false)
                return
            }
            setAble(true)
            setUid(jsObject)
        }}
    />
    </>
}

const TAControl = ({GAME_TIME})=>{
    const [modUID, setModUID] = useState(false)
    return <>
    <div className="info">
        <Time GAME_TIME={GAME_TIME} setModUID={setModUID} modUID={modUID}/>
    </div>
    {modUID && 
        <div className="info" style={{height: "auto", display:"block"}}>
            <UIDs setModUID={setModUID}/>
        </div>
    }
    </>
}

export default TAControl