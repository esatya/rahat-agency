import React, { createContext, useReducer } from 'react';

import * as Service from '../services/appSettings';
import appReduce from '../reducers/appSettingsReducer';
import ACTION from '../actions/appSettings';

const initialState = {
  settings: {
    activeDir: 'ltr',
    activeThemeLayout: 'vertical',
    activeTheme: 'light',
    activeSidebarType: 'full',
    activeLogoBg: 'skin6',
    activeNavbarBg: 'skin1',
    activeSidebarBg: 'skin6',
    activeSidebarPos: 'fixed',
    activeHeaderPos: 'fixed',
    activeLayout: 'full',
  },
  appSettings: { title: 'App Details' },
  tempIdentity: '',
  wallet: null,
  hasWallet: false,
  walletPasscode: null,
  isVerified: false,
  
};

export const AppContext = createContext(initialState);
export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReduce, initialState);

  function getAppSettings() {
    return new Promise((resolve, reject) => {
      Service.getSettings()
        .then((res) => {
          dispatch({ type: ACTION.GET_APP_SUCCESS, res });
          resolve(res);
        })
        .catch((err) => reject(err));
    });
  }
  function setTempIdentity(tempIdentity) {
    dispatch({ type: ACTION.SET_TEMP_IDENTITY, data: tempIdentity });
  }

  function setHasWallet(hasWallet) {
    dispatch({ type: ACTION.SET_HASWALLET, data: hasWallet });
  }

  function setWallet(wallet) {
    dispatch({ type: ACTION.SET_WALLET, data: wallet });
  }
  function changeIsverified(boolArg) {
    dispatch({ type: ACTION.CHANGE_ISVERIFIED, data: boolArg });
  }
  function setWalletPasscode(passcode) {
    dispatch({ type: ACTION.SET_APP_PASSCODE, data: passcode });
  }

  return (
    <AppContext.Provider
      value={{
        settings: state.settings,
        appSettings: state.appSettings,
        tempIdentity: state.tempIdentity,
        hasWallet: state.hasWallet,
        wallet: state.wallet,
        walletPasscode: state.walletPasscode,
        isVerified:state.isVerified,
        getAppSettings,
        setTempIdentity,
        setHasWallet,
        setWallet,
        setWalletPasscode,
        changeIsverified
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
