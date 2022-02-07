import axios from 'axios';

import { getUserToken } from '../utils/sessionManager';
import {Sms} from '../constants/api';


const access_token=getUserToken();

export const sendTokenIssuedSms = async(payload={})=>{
    try{
        await axios.post(`${Sms}/token`,payload,{
            headers: { access_token: access_token }
        })
    }catch(err){
        console.log('Couldnot send sms')
    }
}

export const sendPackageIssuedSms = async (payload={})=>{
    try{
        await axios.post(`${Sms}/package`,payload,{
            headers: { access_token: access_token }
        })
    }catch(err){
        console.log('Couldnot send sms')
    }
}