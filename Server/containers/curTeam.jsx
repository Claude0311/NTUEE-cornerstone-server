import { ListGroup, ListGroupItem, Container, Button } from "reactstrap";
import Countdown from "./countdown";
import ScoreControl from "../components/ScoreControl";
import {useSelector} from 'react-redux';
import { useEffect, useState, memo } from "react";

export default ({props}) => {
    const { id, time_remain, status, current_team, socket } = props
    const [t,setT] = useState(time_remain)
    const [p,setP] = useState(status.point)
    const isLogin = useSelector(state=>state.isLogin)
    const token = useSelector(state=>state.token)
    let timer = null
    useEffect(()=>{
        timer = setInterval(()=>{
            setT(t=>{
                if(t>0) return t-1
                clearInterval(timer)
                return 0
            })
        },1000)
        return ()=>{
            clearInterval(timer)
        }
    },[])
    useEffect(()=>{
        if(socket===null) return
        const update_time = (data) => {
            if(data.id!==id) return
            setT(data.time_remain)
        }
        const UID_added = (data)=>{
            if(data.id!==id) return
            setP(data.point)
        }
        const game_end = (data)=>{
            if(data.id!==id) return
            clearInterval(timer)
        }
        socket.on("update_time", update_time)
        socket.on("UID_added",UID_added)
        socket.on("game_end",game_end)
        socket.on("modify_current_score",UID_added)
        return ()=>{
            if(socket===null) return
            socket.off("update_time", update_time)
            socket.off("UID_added",UID_added)
            socket.off("game_end",game_end)
            socket.off("modify_current_score",UID_added)
        }
    },[socket,id])
    return <div>
        {isLogin && 
            <Button color="danger" onClick={()=>{
                socket.emit("stop_game",{token,id})
            }}>Stop game</Button>
        }
        <div className="info">
            <h2>現在隊伍: {current_team}</h2>    
        </div>
        <div className="info">
            <Countdown time_remain={t} />
        </div>
        <span className="info" >
            <h3 style={{display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',}}>
                得分:{' '}
                {isLogin?
                <table style={{display:"inline-table"}}>
                    <ScoreControl team={null} point={p} id={id}/>
                </table>
                :
                p
                }
            </h3>
        </span>
        <br></br>
    </div>
}