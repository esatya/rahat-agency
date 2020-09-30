import ACTION from "../actions/appSettings";

export default (state, action) => {
  let result = action.res;
  switch (action.type) {
    case ACTION.GET_APP_SUCCESS:
      return {
        ...state,
        appSettings: result,
      };

    default:
      return state;
  }
};
