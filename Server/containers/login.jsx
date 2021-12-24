import React, { useState, useRef } from "react";
import {Button, Form, FormGroup, Input, Label} from 'reactstrap';
import fetch from "isomorphic-fetch";
import Popup from 'reactjs-popup';

export default ({isLogin,setLogin}) => {
    const [password,setP] = useState('')
    const login = ()=>{
        fetch(`http://localhost:3000/login?pass=${password}`)
            .then(res=>{console.log(res.ok)})//;if(res.ok)setLogin(true)})
            .catch(e=>{console.log('e',e);alert('login fail')})
            // .finally(()=>setIn(false))
    }
    const [isin,setIn] = useState(false);
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
            isin ?
            <Form onSubmit={()=>login()}>
                <FormGroup>
                <Label for="examplePassword">
                    Password
                </Label>
                <Input
                    id="examplePassword"
                    name="password"
                    placeholder="password placeholder"
                    type="password"
                    value={password}
                    onChange={(e)=>setP(e.target.value)}
                />
                </FormGroup>
            </Form>
            :
            <Button color="danger" onClick={()=>setIn(true)}>TA Login</Button>
            }
        </div>
    );
};
