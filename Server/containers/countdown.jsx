import React, { useEffect, useState } from "react";
import { ListGroupItem } from "reactstrap";

const Count = (props) => {
  // let [seconds, setseconds] = useState(120);
  // useEffect(() => {
  //   const timer = setInterval(
  //     () =>
  //       setseconds((second) => {
  //         if (second > 0) return second - 1;
  //         else return 0;
  //       }),
  //     1000
  //   );
  //   return () => clearInterval(timer);
  // });
  let minutes = Math.floor(props.time_remain / 60);
  let show_seconds = props.time_remain - minutes * 60;
  let msg = props.msg || "剩餘時間"
  return (
      <h2>{msg}: {minutes} 分 {show_seconds} 秒</h2>
  );
};

export default Count