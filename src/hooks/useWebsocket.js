import {useEffect,useRef,useState,useCallback} from 'react';
import {WSS_SERVER,WSS_EVENTS} from '../constants' 
const noop = ()=>{}


export const useWebsocket=()=> {    
    const webSocket = useRef(null)
    const connectSocket = useCallback(()=>{
        webSocket.current= new WebSocket(WSS_SERVER)
    },[])
    
    const reconnect = useCallback(()=>{
        const timeout = 10000
        let pollingTime = 0;
        if(webSocket.current.readyState===1)clearTimeout(pollingTime)     
        if(webSocket.current.readyState===3){
            connectSocket()
            pollingTime= setTimeout(reconnect,timeout)           
        }   
        
        
    },[connectSocket])

    const initSocket = useCallback(()=>{
        if(!webSocket) return       
        webSocket.current.onclose= event=>{
           reconnect()
            }
        webSocket.current.onerror= event=>{
            reconnect()
            }
    },[reconnect])

    useEffect(()=>{
        connectSocket()     
        initSocket()
        return ()=>webSocket.current.close()
    },[connectSocket,initSocket])

    return webSocket
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

