import React, { useState } from "react";
import Table from "../components/table";
import {Button} from 'reactstrap';
import fetch from "isomorphic-fetch";

export default (props) => {
    return (
        <div>
            {props.isLogin&&
               <Button color="danger" onClick={()=>{
                    fetch("http://localhost:3000/ta/reset?pass=taonly")
                }}>Clear data</Button>
            }
            <Table history={props.history[0]} isLogin={props.isLogin}/>
        </div>
    );
};
