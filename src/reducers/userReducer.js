import ACTION from "../actions/users";

export default (state, action) => {
  switch (action.type) {
    case `${ACTION.GET}`:
      return {
        ...state,
        user_info: action.data,
      };

    default:
      return state;
  }
};
