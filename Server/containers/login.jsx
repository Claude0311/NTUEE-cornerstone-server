import React, { useState } from "react";
import {Button} from 'reactstrap';
import fetch from "isomorphic-fetch";

export default ({isLogin,setLogin}) => {
    const login = ()=>{
        const password = prompt("TA password")
        fetch(`http://localhost:3000/login?pass=${password}`)
            .then(res=>{setLogin(true)})
            .catch(e=>{console.log('e',e)})
    }
    const logout = ()=>{
        fetch(`http://localhost:3000/logout`)
            .then(res=>{setLogin(false)})
            .catch(e=>{console.log('e',e)})
    }
    return (
        <div>
            {isLogin?
            <Button color="danger" onClick={logout}>TA Logout</Button>
            :
            <Button color="danger" onClick={login}>TA Login</Button>
            }
        </div>
    );
};
