import {useDispatch} from 'react-redux';

export default (props) => {
    const dispatch = useDispatch()
    dispatch({type:'setIp',payload:props.ip})
    return (<></>);
};