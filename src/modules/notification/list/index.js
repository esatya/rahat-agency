import React,{useEffect,useState,useCallback} from 'react';
import {
	Card,
	CardBody,
	CardTitle,	
	Row,
	Col,

} from 'reactstrap';
import { History } from '../../../utils/History';

import * as CONFIG from '../../../layouts/layout-components/header/config'

import AdvancePagination from '../../global/AdvancePagination';

import * as Notification_Service from '../../../services/notification'
import { APP_CONSTANTS } from '../../../constants';

const { PAGE_LIMIT } = APP_CONSTANTS;

function List() {

  const [notifications,setNotifications] = useState(null);
	const [totalRecords, setTotalRecords] = useState(null);

  const getIcons = notification=>{
		const iconConfig = CONFIG.ICONS(notification?.notificationType)
			return{
				...notification,
				...iconConfig		
			}
	}

  const fetchNotifications = useCallback(async(query={})=>{
    try{
      const params= { start: 0, limit: PAGE_LIMIT, ...query };
      const list= await Notification_Service.listNotifications(params)
      let {total,data} = list
      setTotalRecords(total)
      if(data&&data.length>0){
        data = data.map((item)=>{
          const iconConfig = getIcons(item)
          return{
            ...item,
            ...iconConfig		
          }
        }) 
        setNotifications([...data])}
      setNotifications(data)
    }catch(err){

    }
  },[])

	const onPageChanged = useCallback(
		async paginationData => {			
			const { currentPage, pageLimit } = paginationData;
			let start = (currentPage - 1) * pageLimit;
			const query = { start, limit: PAGE_LIMIT };
			fetchNotifications(query);
		},
		[ fetchNotifications]
	);
  const handleNotificationSeen=useCallback(async(id)=>{
		try{
			let updatedNotification = await Notification_Service.update(id,{status:true});
			updatedNotification=getIcons(updatedNotification)
			let prevNotifications = [...notifications];
			prevNotifications= prevNotifications&&prevNotifications.length&&prevNotifications.map((item)=>{
				if(item._id===updatedNotification._id){
					return{
						...updatedNotification
					}
				}
				return item
			})

			setNotifications(prevNotifications)
		}catch(err){}
	},[notifications])

 
  const redirect = useCallback(async(id,redirectUrl)=>{
		const isSeen = notifications.find(item=>item._id===id)?.status;
		 redirectUrl&&History.push(redirectUrl)
		 if(isSeen) return;
		 handleNotificationSeen(id)
	},[handleNotificationSeen,notifications])

  useEffect(()=>{
    fetchNotifications()

    return()=>setNotifications(null)
  },[fetchNotifications])

  return   <div className="main">  
  <div className="transaction-table-container">
				<Card>
					<CardTitle className="mb-0 p-3">
						<Row>
							<Col md="4">Notification</Col>
							<Col md="6">
								<div
									style={{
										float: 'right',
										display: 'flex'
									}}
								>
							
								
								</div>
							</Col>
						
						</Row>
					</CardTitle>
					<CardBody className="mailbox">
          <div className={"message-center notifications"}>
								{notifications?.length ? (
									notifications.map((notification, index) => (
                    <span className={`message-item ${!notification.status&&"bg-info bg-opacity-10"}`} key={index}
                    onClick={()=>redirect(notification._id,notification?.redirectUrl)}
                    >
                    <span
                      className={
                        `btn btn-circle btn-${notification.iconBg}`
                      }
                    >
                      <i className={notification.iconClass} />
                    </span>
                    <div className="mail-contnet">
                      <h5 className={`message-title ${!notification.status&&"text-white"}`}>
                        {notification.title}
                      </h5>
                      <span className={`mail-desc  ${!notification.status&&"text-white"} `}>{notification.message}</span>
                      <span className={` time   ${!notification.status&&"text-white"}` }>{notification.date}</span>
                    </div>
                  </span>
									))
								) : (
                  <span className={`message-item `} >
											No data available
										</span>
								
								)}
					

						{totalRecords > 0 && (
							<AdvancePagination
								totalRecords={totalRecords}
								pageLimit={PAGE_LIMIT}
								pageNeighbours={1}
								onPageChanged={onPageChanged}
							/>
						)}
            </div>
					</CardBody>
				</Card>
			</div></div>;
}

export default List;
