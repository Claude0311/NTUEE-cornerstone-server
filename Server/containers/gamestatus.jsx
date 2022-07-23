import React from "react";
import { ListGroup, ListGroupItem, Container, Button } from "reactstrap";
import Countdown from "./countdown";
import ScoreControl from "../components/ScoreControl";
import {useSelector} from 'react-redux';

export default (props) => {
    const current = [{ time_remain:90, status:{point:0}, current_team:"Nobody" },{ time_remain:90, status:{point:0}, current_team:"Nobody" },{ time_remain:90, status:{point:0}, current_team:"Nobody" }]
    const { GAME_TIME } = props.game_info;
    const socket = props.socket
    const isLogin = useSelector(state=>state.isLogin)
    const token = useSelector(state=>state.token)
    const blkGen = ({ time_remain, status, current_team })=><>
        {isLogin && 
            <Button color="danger" onClick={()=>{
                socket.emit("stop_game",{token})
            }}>Stop game</Button>
        }
        <div className="info">
            <h2>現在隊伍: {current_team}</h2>    
        </div>
        <div className="info">
            <Countdown time_remain={time_remain} />
        </div>
        <span className="info" >
            <h3 style={{display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',}}>
                得分:{' '}
                {isLogin?
                <table style={{display:"inline-table"}}>
                    <ScoreControl team={null} point={status.point}/>
                </table>
                :
                status.point
                }
            </h3>
        </span>
        <br></br>
    </>
    return (
        <div className="status">
            {
                current.length===0?
                blkGen({ time_remain:GAME_TIME, status:{point:0}, current_team:"Nobody" }):
                current.map(blkGen)
            }
        </div>
    );
};
