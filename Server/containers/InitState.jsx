import {useDispatch,useSelector} from 'react-redux';
export default ({ip,token}) => {
    const dispatch = useDispatch()
    if(token!==''){
        dispatch({type:'login',payload:true})
        dispatch({type:'set_token',payload:token})
    }
    dispatch({type:'setIp',payload:ip})
    return (<></>);
};