import { useState } from "react";
import { ButtonGroup, Button, Input } from "reactstrap";
import fetch from "isomorphic-fetch";
import ScoreControl from './ScoreControl';
import { useSelector } from "react-redux";

const colors = [
    "gold",
    "silver",
    "red",
    "green",
    "lightseagreen",
    "dodgerblue",
    "darkblue",
    "darkmagenta",
    "indigo",
    "white",
    "black",
];

export default ({team, tbkey:key, isLogin}) => {
    // const isLogin = useSelector(state=>state.isLogin)
    return (
    <tr key={key}>
        <td>
            <div
                style={{
                    fontSize: "20px",
                    color: "white",
                    lineHeight: "60px",
                    width: "60px",
                    height: "60px",
                    background: colors[key % 10],
                    borderRadius: "50%",
                    textAlign: "center",
                    verticalAlign: "middle",
                }}
            >
                {key+1}
            </div>
        </td>
        <td className="rank" style={{ verticalAlign: "middle"}}>
            {team.name}
        </td>
        {isLogin?
        <ScoreControl team={team.name} point={team.point}/>
        :
        <td className="rank" style={{ verticalAlign: "middle"}}>
            {team.point}
        </td>
        }
        <td className="rank" style={{ verticalAlign: "middle"}}>
            {team.last_eaten}
        </td>
    </tr>
)};