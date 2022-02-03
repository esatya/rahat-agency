import axios from 'axios';
import { Notification } from '../constants/api';


export const listNotifications=async(query)=>{
   const res= await axios.get(Notification, { query});
   return res.data
}