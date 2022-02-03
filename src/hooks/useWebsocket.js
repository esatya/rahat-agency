import {useEffect,useRef,useState} from 'react';
import {WSS_SERVER,WSS_EVENTS} from '../constants' 
const noop = ()=>{}
export const useWebsocket=()=> {    
    const webScoket = useRef(null)
    useEffect(()=>{
        webScoket.current = new WebSocket(WSS_SERVER)
        return ()=>webScoket.current.close()
    },[])

    return webScoket
}


export const useWSNotification = (mutaion=noop)=>{
    const websocket = useWebsocket();
    const [notification,setNotifications] = useState(null)

    useEffect(()=>{
    if(!websocket.current) return;
    websocket.current.onmessage=async socketEvent=>{
        if(!socketEvent?.data) return;
        let {data} = socketEvent;
        const {action,...rest} = JSON.parse(data||{})
        if(action!==WSS_EVENTS.notification) return;        
        const newNotification = rest
        setNotifications(newNotification)
    }
    },[websocket])
    return notification
}

