import React, { useState, useRef } from "react";
import {Button, Form, FormGroup, Input, Label} from 'reactstrap';
import fetch from "isomorphic-fetch";
import {useSelector, useDispatch} from 'react-redux';
import Cookies from 'js-cookie'

export default () => {
    const ip = useSelector(state=>state.ip)
    const isLogin = useSelector(state=>state.isLogin)
    const dispatch = useDispatch()
    const setLogin = (payload)=>{dispatch({type:'login',payload})}
    const setToken = (payload)=>{dispatch({type:'set_token',payload})}
    const [password,setP] = useState('')
    const [isTyping,setTyping] = useState(false);

    const login = ()=>{
        fetch(`${ip}/ta/login`,{
            method: 'POST',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body: JSON.stringify({ pass: password })
          }
        )
        .then(async res=>{
            const {token} = await res.json()
            if(token){
                console.log('tk',token)
                setLogin(true)
                setToken(token)
                Cookies.set('token',token)
            }
        })
        .catch(e=>{console.log(e);alert('login fail')})
        .finally(()=>{setTyping(false);setP('')})
    }
    const logout = ()=>{
        setLogin(false)
        setToken('')
        Cookies.set('token','')
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
