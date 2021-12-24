import React, { useState } from "react";
import Table from "../components/table";
import {Button} from 'reactstrap';
import fetch from "isomorphic-fetch";

export default (props) => {
    return (
        <div>
            {props.isLogin&&
               <Button color="danger" onClick={()=>{
                    fetch(`${props.ip}/ta/reset?pass=taonly`)
                }}>Clear data</Button>
            }
            <Table ip={props.ip} history={props.history[0]} isLogin={props.isLogin}/>
        </div>
    );
};
