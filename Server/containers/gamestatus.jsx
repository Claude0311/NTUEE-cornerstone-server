import React from "react";
import CurTeam from "./curTeam";
import Countdown from "./countdown";

export default (props) => {
    // const current = [{ time_remain:90, status:{point:0}, current_team:"Nobody" },{ time_remain:90, status:{point:0}, current_team:"Nobody" },{ time_remain:90, status:{point:0}, current_team:"Nobody" }]
    const { GAME_TIME, current } = props.game_info;
    const socket = props.socket
    return (
        <div className="status">
            <div className="info">
                <Countdown time_remain={GAME_TIME} msg={"比賽時間"}/>
            </div>
            <br></br>
            {
                current.map((p)=><CurTeam key={p.id} props={{...p,socket}}/>)
            }
        </div>
    );
};
