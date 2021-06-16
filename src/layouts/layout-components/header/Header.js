import React, { useState, useContext, useEffect } from 'react';
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
  DropdownItem,
} from 'reactstrap';

import { AppContext } from '../../../contexts/AppSettingsContext';
import { getUser, logoutUser } from '../../../utils/sessionManager';
import { History } from '../../../utils/History';

/*--------------------------------------------------------------------------------*/
/* Import images which are need for the HEADER                                    */
/*--------------------------------------------------------------------------------*/
import logotext from '../../../assets/images/logo-dark.png';
import profilephoto from '../../../assets/images/users/1.jpg';

export default () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const { settings, appSettings, getAppSettings } = useContext(AppContext);

  const loadAppSettings = () => {
    getAppSettings().then();
  };

  const getUserDetails = () => {
    let user = getUser();
    setCurrentUser(user);
  };

  useEffect(getUserDetails, []);
  useEffect(loadAppSettings, []);

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

  const handleProfileLink = () => {
    History.push('/profile');
  };

  const handleMyWalletLink = () => {
    History.push('/wallet');
  };

  if (appSettings && appSettings.isSetup === false)
    window.location.replace('/setup');

  return (
    <header className="topbar navbarbg" data-navbarbg={settings.activeNavbarBg}>
      <Navbar
        className={
          'top-navbar ' +
          (settings.activeNavbarBg === 'skin6' ? 'navbar-light' : 'navbar-dark')
        }
        expand="md"
      >
        <div
          className="navbar-header"
          id="logobg"
          data-logobg={settings.activeLogoBg}
        >
          {/*--------------------------------------------------------------------------------*/}
          {/* Mobile View Toggler  [visible only after 768px screen]                         */}
          {/*--------------------------------------------------------------------------------*/}
          <span
            className="nav-toggler d-block d-md-none"
            onClick={showMobilemenu.bind(null)}
          >
            <i className="ti-menu ti-close" />
          </span>
          {/*--------------------------------------------------------------------------------*/}
          {/* Logos Or Icon will be goes here for Light Layout && Dark Layout                */}
          {/*--------------------------------------------------------------------------------*/}
          <NavbarBrand href="/">
            <b className="logo-icon">
              {/* <img src={logoicon} alt="homepage" className="dark-logo" /> */}
            </b>
            <span className="logo-text">
              <img
                style={{ height: 60 }}
                src={logotext}
                alt="homepage"
                className="dark-logo"
              />
            </span>
          </NavbarBrand>
          {/*--------------------------------------------------------------------------------*/}
          {/* Mobile View Toggler  [visible only after 768px screen]                         */}
          {/*--------------------------------------------------------------------------------*/}
          <span
            className="topbartoggler d-block d-md-none"
            onClick={toggle.bind(null)}
          >
            <i className="ti-more" />
          </span>
        </div>
        <Collapse
          className="navbarbg"
          isOpen={isOpen}
          navbar
          data-navbarbg={settings.activeNavbarBg}
        >
          <Nav className="float-left" navbar>
            <NavItem>
              <NavLink
                href="#"
                className="d-none d-md-block"
                onClick={sidebarHandler.bind(null)}
              >
                <i className="ti-menu" />
              </NavLink>
            </NavItem>
            {/*--------------------------------------------------------------------------------*/}
          </Nav>
          <Nav className="ml-auto float-right" navbar>
            {/*--------------------------------------------------------------------------------*/}

            {/*--------------------------------------------------------------------------------*/}
            {/* Start Profile Dropdown                                                         */}
            {/*--------------------------------------------------------------------------------*/}
            <UncontrolledDropdown nav inNavbar>
              <DropdownToggle nav caret className="pro-pic">
                <img
                  src={profilephoto}
                  alt="user"
                  className="rounded-circle"
                  width="31"
                />
              </DropdownToggle>
              <DropdownMenu right className="user-dd">
                <span className="with-arrow">
                  <span className="bg-primary" />
                </span>
                <div className="d-flex no-block align-items-center p-3 bg-primary text-white mb-2">
                  <div className="">
                    <img
                      src={profilephoto}
                      alt="user"
                      className="rounded-circle"
                      width="60"
                    />
                  </div>
                  <div className="ml-2">
                    <h4 className="mb-0">
                      {currentUser && currentUser.name
                        ? currentUser.name.first + ' ' + currentUser.name.last
                        : ''}
                    </h4>
                    <p className=" mb-0">
                      {currentUser && currentUser.email
                        ? currentUser.email
                        : ''}
                    </p>
                  </div>
                </div>
                <DropdownItem onClick={handleMyWalletLink}>
                  <i className="ti-wallet mr-1 ml-1" /> My Wallet
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
