import ACTION from "../actions/onboard";

export default (state, action) => {
  switch (action.type) {
    case `${ACTION.LIST}`:
      return {
        ...state,
        data: action.data.data,
        pagination: {
          limit: parseInt(action.data.limit),
          start: parseInt(action.data.start),
          total: parseInt(action.data.total),
          page: parseInt(action.data.page)
        },
        query: { name: action.data.name, phone: action.data.phone }
      };

    case `${ACTION.SET_LOADING}`:
      return {
        ...state,
        loading: true
      };

    case `${ACTION.RESET_LOADING}`:
      return {
        ...state,
        loading: false
      };

    default:
      return state;
  }
};
