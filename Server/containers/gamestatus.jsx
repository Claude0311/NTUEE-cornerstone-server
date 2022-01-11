import React from "react";
import { ListGroup, ListGroupItem, Container, Button } from "reactstrap";
import Countdown from "./countdown";
import ScoreControl from "../components/ScoreControl";
import {useSelector} from 'react-redux';

export default (props) => {
    const { time_remain, status, current_team } = props.game_info;
    const socket = props.socket
    const isLogin = useSelector(state=>state.isLogin)
    const token = useSelector(state=>state.token)
    //console.log(props);
    return (
        <div className="status">
            {isLogin && 
                <Button color="danger" onClick={()=>{
                    socket.emit("stop_game",{token})
                }}>Stop game</Button>
            }
            <div className="info">
                <h2>現在隊伍: {current_team}</h2>    
            </div>
            <br></br>
            <div className="info">
                <Countdown time_remain={time_remain} />
            </div>
            <br></br>
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
        </div>
    );
};
