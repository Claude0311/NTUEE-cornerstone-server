import React from "react";
import { ListGroup, ListGroupItem, Container } from "reactstrap";
import Countdown from "./countdown";
export default (props) => {
    const { time_remain, status, current_team } = props.game_info;
    //console.log(props);
    return (
        <div className="status">
            <div className="info">
                <h2>現在隊伍: {current_team}</h2>    
            </div>
            <br></br>
            <div className="info">
                <Countdown time_remain={time_remain} />
            </div>
            <br></br>
            <div className="info">
                 <h3>得分: {status.point}</h3>
            </div>
        </div>
    );
};
