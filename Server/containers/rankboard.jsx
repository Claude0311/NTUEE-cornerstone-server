import React, { useState } from "react";
import Table from "../components/table";

export default (props) => {
    return (
        <div>
            <Table history={props.history[0]} />
        </div>
    );
};
