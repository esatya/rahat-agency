import ACTION from '../actions/appSettings';

export default (state, action) => {
  let result = action.res;
  switch (action.type) {
    case ACTION.GET_APP_SUCCESS:
      return {
        ...state,
        appSettings: result,
      };

    case ACTION.SET_TEMP_IDENTITY:
      return {
        ...state,
        tempIdentity: action.data,
      };
    case ACTION.SET_WALLET:
      return {
        ...state,
        wallet: action.data,
      };

    case ACTION.SET_HASWALLET:
      return {
        ...state,
        hasWallet: action.data,
      };

    default:
      return state;
  }
};
