import React, { useState, useRef } from "react";
import {Button, Form, FormGroup, Input, Label} from 'reactstrap';
import fetch from "isomorphic-fetch";
import {useSelector, useDispatch} from 'react-redux';

export default () => {
    const ip = useSelector(state=>state.ip)
    const isLogin = useSelector(state=>state.isLogin)
    const dispatch = useDispatch()
    const setLogin = (payload)=>{dispatch({type:'login',payload})}
    const [password,setP] = useState('')
    const [isTyping,setTyping] = useState(false);

    const login = ()=>{
        fetch(`${ip}/login?pass=${password}`, {credentials: 'same-origin'})
            .then(res=>{console.log(res.ok);if(res.ok)setLogin(true)})
            .catch(e=>{console.log('e',e);alert('login fail')})
            .finally(()=>{setTyping(false);setP('')})
    }
    const logout = ()=>{
        fetch(`${ip}/logout`)
            .then(res=>{setLogin(false)})
            .catch(e=>{console.log('e',e)})
    }
    return (
        <div>
            {isLogin?
            <Button color="danger" onClick={logout}>TA Logout</Button>
            :
            isTyping ?
            <Form inline onSubmit={(e)=>e.preventDefault()}>
                <Input type="password"
                placeholder="password"
                onKeyPress={(target)=>{ if(target.charCode==13) login() }}
                value={password}
                onChange={(e)=>setP(e.target.value)}
                />
                <Button onClick={login}>Login</Button>
            </Form>
            :
            <Button color="danger" onClick={()=>setTyping(true)}>TA Login</Button>
            }
        </div>
    );
}
