import React, { useState, useContext, useEffect, useCallback } from 'react';
import {
	Nav,
	NavItem,
	NavLink,
	Navbar,
	NavbarBrand,
	Collapse,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap';
import FeatherIcon from 'feather-icons-react';

import { AppContext } from '../../../contexts/AppSettingsContext';
import { getUser, logoutUser } from '../../../utils/sessionManager';
import { History } from '../../../utils/History';

/*--------------------------------------------------------------------------------*/
/* Import images which are need for the HEADER                                    */
/*--------------------------------------------------------------------------------*/
import logotext from '../../../assets/images/main_logo.png';
import profilephoto from '../../../assets/images/users/1.jpg';
import {useWSNotification} from '../../../hooks/useWebsocket';
import * as API_CALLS from '../../../services/notification'
import * as CONFIG from './config'



export default () => {
	const [isOpen, setIsOpen] = useState(false);
	const [currentUser, setCurrentUser] = useState({});
	const [notifications,setNotifications] = useState(null)
	const { settings, appSettings, getAppSettings } = useContext(AppContext);	
	const wsNotification =useWSNotification()

	const getIcons = notification=>{
		const iconConfig = CONFIG.ICONS(notification?.notificationType)
			return{
				...notification,
				...iconConfig		
			}
	}

	const fetchNotifications = useCallback(async(query={})=>{
	try{
	let {data} = await API_CALLS.listNotifications(query);
	if(data&&data.length>0){
		data = data.map((item)=>{
			const iconConfig = getIcons(item)
			return{
				...item,
				...iconConfig		
			}
		}) 
		setNotifications([...data])}
	}catch(err){
		console.log("Error while fetching notifications",err)
	}
	},[])


	const handleNewNotification = useCallback(()=>{
		if(!wsNotification) return;
		console.log({wsNotification})
		if(!notifications||!notifications.length){
			const configNotification = getIcons(wsNotification)
			setNotifications([configNotification])
			return;
		}
		const isAlreadyPresent = notifications.some(element=>element._id===wsNotification._id)
		if(!isAlreadyPresent){
			let combinedArray = [wsNotification,...notifications].map(item=>getIcons(item));
			setNotifications(combinedArray)
		}
	},[notifications,wsNotification])


	const handleNotificationSeen=useCallback(async(id)=>{
		try{
			let updatedNotification = await API_CALLS.update(id,{status:true});
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

	const loadAppSettings = useCallback(() => {
		return getAppSettings().then().catch(err=>console.log('Cannot get app setting'));
	},[getAppSettings]);

	const getUserDetails = useCallback(() => {
		let user = getUser();
		setCurrentUser(user);
	},[]);

	useEffect(getUserDetails, [getUserDetails]);
	useEffect(loadAppSettings, [loadAppSettings]);
	useEffect(fetchNotifications, [fetchNotifications]);
	useEffect(handleNewNotification, [handleNewNotification]);

	const toggle = () => {
		setIsOpen(!isOpen);
	};

	const showMobilemenu = () => {
		document.getElementById('main-wrapper').classList.toggle('show-sidebar');
	};

	const handleLogout = () => {
		logoutUser();
	};

	const sidebarHandler = () => {
		let element = document.getElementById('main-wrapper');
		switch (settings.activeSidebarType) {
			case 'full':
			case 'iconbar':
				element.classList.toggle('mini-sidebar');
				if (element.classList.contains('mini-sidebar')) {
					element.setAttribute('data-sidebartype', 'mini-sidebar');
				} else {
					element.setAttribute('data-sidebartype', settings.activeSidebarType);
				}
				break;

			case 'overlay':
			case 'mini-sidebar':
				element.classList.toggle('full');
				if (element.classList.contains('full')) {
					element.setAttribute('data-sidebartype', 'full');
				} else {
					element.setAttribute('data-sidebartype', settings.activeSidebarType);
				}
				break;
			default:
		}
	};

	const redirect = useCallback(async(id,redirectUrl)=>{
		const isSeen = notifications.find(item=>item._id===id)?.status;
		 redirectUrl&&History.push(redirectUrl)
		 if(isSeen) return;
		 handleNotificationSeen(id)
	},[handleNotificationSeen,notifications])



	const handleProfileLink = () => {
		History.push('/profile');
	};

	if (appSettings && appSettings.isSetup === false) window.location.replace('/setup');

	return (
		<header className="topbar navbarbg" data-navbarbg={settings.activeNavbarBg}>
			<Navbar
				className={'top-navbar ' + (settings.activeNavbarBg === 'skin6' ? 'navbar-light' : 'navbar-dark')}
				expand="md"
			>
				<div className="navbar-header" id="logobg" data-logobg={settings.activeLogoBg}>
					{/*--------------------------------------------------------------------------------*/}
					{/* Mobile View Toggler  [visible only after 768px screen]                         */}
					{/*--------------------------------------------------------------------------------*/}
					<span className="nav-toggler d-block d-md-none" onClick={showMobilemenu.bind(null)}>
						<i className="ti-menu ti-close" />
					</span>
					{/*--------------------------------------------------------------------------------*/}
					{/* Logos Or Icon will be goes here for Light Layout && Dark Layout                */}
					{/*--------------------------------------------------------------------------------*/}
					<NavbarBrand href="/">
						<b className="logo-icon">{/* <img src={logoicon} alt="homepage" className="dark-logo" /> */}</b>
						<span className="logo-text">
							<img style={{ height: 60 }} src={logotext} alt="homepage" className="dark-logo" />
						</span>
					</NavbarBrand>
					{/*--------------------------------------------------------------------------------*/}
					{/* Mobile View Toggler  [visible only after 768px screen]                         */}
					{/*--------------------------------------------------------------------------------*/}
					<span className="topbartoggler d-block d-md-none" onClick={toggle.bind(null)}>
						<i className="ti-more" />
					</span>
				</div>
				<Collapse className="navbarbg" isOpen={isOpen} navbar data-navbarbg={settings.activeNavbarBg}>
					<Nav className="float-left" navbar>
						<NavItem>
							<NavLink href="#" className="d-none d-md-block" onClick={sidebarHandler.bind(null)}>
								<i className="ti-menu" />
							</NavLink>
						</NavItem>
						{/*--------------------------------------------------------------------------------*/}
					</Nav>
					<Nav className="ml-auto float-right" navbar>
						{/*--------------------------------------------------------------------------------*/}

						<UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret>
			  <FeatherIcon icon="bell" fill={wsNotification&&'orange'} />

              </DropdownToggle>
              <DropdownMenu right className="mailbox">
                <span className="with-arrow">
                  <span className="bg-primary" />
                </span>
                <div className="d-flex drop-title no-block align-items-center p-3 bg-primary text-white mb-2">
                  <div className="">
                    <h4 className="mb-0">{notifications?.length} New</h4>
                    <p className="mb-0">Notifications</p>
                  </div>
                </div>
                <div className={"message-center notifications"}>
                  {/*<!-- Message -->*/}
                  {notifications?.map((notification, index) => {
                    return (
                      <span className={`message-item ${!notification.status&&"bg-info bg-opacity-10"}`} key={index} onClick={()=>redirect(notification._id,notification?.redirectUrl)} >
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
                    );
                  })}
                </div>
                <a className="nav-link text-center mb-1 text-dark" href="/notifications" >
                  <strong>Check all notifications</strong>{" "}
                  <i className="fa fa-angle-right" />
                </a>
              </DropdownMenu>
            </UncontrolledDropdown>

						{/*--------------------------------------------------------------------------------*/}
						{/* Start Profile Dropdown                                                         */}
						{/*--------------------------------------------------------------------------------*/}
						<UncontrolledDropdown nav inNavbar>
							<DropdownToggle nav caret className="pro-pic">
								<img src={profilephoto} alt="user" className="rounded-circle" width="31" />
							</DropdownToggle>
							<DropdownMenu right className="user-dd">
								<span className="with-arrow">
									<span className="bg-primary" />
								</span>
								<div className="d-flex no-block align-items-center p-3 bg-primary text-white mb-2">
									<div className="">
										<img src={profilephoto} alt="user" className="rounded-circle" width="60" />
									</div>
									<div className="ml-2">
										<h4 className="mb-0">
											{currentUser && currentUser.name ? currentUser.name.first + ' ' + currentUser.name.last : ''}
										</h4>
										<p className=" mb-0">{currentUser && currentUser.email ? currentUser.email : ''}</p>
									</div>
								</div>
								<DropdownItem onClick={handleProfileLink}>
									<i className="ti-wallet mr-1 ml-1" /> My Balance
								</DropdownItem>

								<DropdownItem divider />
								<DropdownItem onClick={handleProfileLink}>
									<i className="ti-settings mr-1 ml-1" /> My Account
								</DropdownItem>
								<DropdownItem divider />
								<DropdownItem onClick={handleLogout}>
									<i className="fa fa-power-off mr-1 ml-1" /> Logout
								</DropdownItem>
								<DropdownItem divider />
							</DropdownMenu>
						</UncontrolledDropdown>
						{/*--------------------------------------------------------------------------------*/}
						{/* End Profile Dropdown                                                           */}
						{/*--------------------------------------------------------------------------------*/}
					</Nav>
				</Collapse>
			</Navbar>
		</header>
	);
};
