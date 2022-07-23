import React from "react";
import CurTeam from "./curTeam";
export default (props) => {
    // const current = [{ time_remain:90, status:{point:0}, current_team:"Nobody" },{ time_remain:90, status:{point:0}, current_team:"Nobody" },{ time_remain:90, status:{point:0}, current_team:"Nobody" }]
    const { GAME_TIME, current } = props.game_info;
    const { socket } = props
    return (
        <div className="status">
            {
                current.length===0?
                CurTeam({ time_remain:GAME_TIME, status:{point:0}, current_team:"Nobody", socket }):
                current.map((p)=>CurTeam({...p,socket}))
            }
        </div>
    );
};
