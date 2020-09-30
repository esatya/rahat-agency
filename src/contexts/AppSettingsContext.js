import React, { createContext, useReducer } from "react";

import * as Service from "../services/appSettings";
import appReduce from "../reducers/appSettingsReducer";
import ACTION from "../actions/appSettings";

const initialState = {
  settings: {
    activeDir: "ltr",
    activeThemeLayout: "vertical",
    activeTheme: "light",
    activeSidebarType: "full",
    activeLogoBg: "skin6",
    activeNavbarBg: "skin1",
    activeSidebarBg: "skin6",
    activeSidebarPos: "fixed",
    activeHeaderPos: "fixed",
    activeLayout: "full",
  },
  appSettings: { title: "App Details" },
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

  return (
    <AppContext.Provider
      value={{
        settings: state.settings,
        appSettings: state.appSettings,
        getAppSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
