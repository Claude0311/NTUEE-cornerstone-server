import React from "react";
import { useSelector } from "react-redux";
import { Table } from "reactstrap";
import OneTeam from "./oneTeam";

function sort_rank(team1, team2) {
    if(team2.point - team1.point !=0){
        return team2.point - team1.point;
    }
    else {
        return team2.last_eaten - team1.last_eaten;
    }
}
const MyTable = (props) => {
    const isLogin = useSelector(state=>state.isLogin)
    const { history } = props;
    let ranklist = [];
    for (let team in history) {
        ranklist.push({
            name: team,
            point: history[team].point,
            last_eaten: history[team].last_eaten_time,
            time: history[team].time,
        });
    }
    ranklist.sort(sort_rank);
    return (
        <Table>
            <thead>
                <tr>
                    <th className="rank">排名</th>
                    <th className="rank">隊名</th>
                    <th className="rank">得分</th>
                    {isLogin &&
                        <th className="rank">modify</th>
                    }
                    <th className="rank">最終得分時間(秒)</th>
                </tr>
            </thead>
            <tbody>{ranklist.map((team,key)=><OneTeam key={key}
                team={team} tbkey={key} isLogin={isLogin}
            />)}</tbody>
        </Table>
    );
};

export default MyTable