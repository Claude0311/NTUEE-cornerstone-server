import {useDispatch,useSelector} from 'react-redux';
const Init = ({ip,token}) => {
    const dispatch = useDispatch()
    if(token){
        dispatch({type:'login',payload:true})
        dispatch({type:'set_token',payload:token})
    }
    dispatch({type:'setIp',payload:ip})
    return (<></>);
};

export default Init;