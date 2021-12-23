import React, { useState } from "react";
import Table from "../components/table";
import {Button} from 'reactstrap';
import fetch from "isomorphic-fetch";

export default (props) => {
    return (
        <div>
            <Button color="danger" onClick={()=>{
                fetch("http://localhost:3000/reset?pass=taonly")
            }}>Clear data</Button>
            <Table history={props.history[0]} />
        </div>
    );
};
