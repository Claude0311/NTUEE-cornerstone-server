import React from "react";
import CurTeam from "./curTeam";
import Countdown from "./countdown";
import TimeControl from "../components/TimeControl";
import { useSelector } from "react-redux";

const GameStatus = (props) => {
    // const current = [{ time_remain:90, status:{point:0}, current_team:"Nobody" },{ time_remain:90, status:{point:0}, current_team:"Nobody" },{ time_remain:90, status:{point:0}, current_team:"Nobody" }]
    const { GAME_TIME, current } = props.game_info;
    const socket = props.socket
    const isLogin = useSelector(state=>state.isLogin)
    return (
        <div className="status">
            <div>
                {isLogin?
                    <TimeControl GAME_TIME={GAME_TIME}/>
                    :
                    <div className="info">
                        <Countdown time_remain={GAME_TIME} msg={"比賽時間"}/>
                    </div>
                }
            </div>
            <br></br>
            {
                current.map((p)=><CurTeam key={p.id} props={{...p,socket}}/>)
            }
        </div>
    );
};

export default GameStatus