import ACTION from "../actions/beneficiary";

export default (state, action) => {
  switch (action.type) {
    case `${ACTION.LIST}`:
      return {
        ...state, // beneficiary_list, aid
        list: action.data.data,
        pagination: {
          limit: parseInt(action.data.limit),
          start: parseInt(action.data.start),
          total: parseInt(action.data.total),
          page: parseInt(action.data.page),
        },
        query: { name: action.data.name, phone: action.data.phone },
      };

    case `${ACTION.LIST_AID}`:
      return {
        ...state,
        aids: action.data.aids,
      };

    case `${ACTION.SET_AID}`:
      return {
        ...state,
        aid: action.data,
      };

    case `${ACTION.SET_BENEFICIARY}`:
      return {
        ...state,
        beneficiary: action.data,
      };

    case `${ACTION.SET_TOKEN_BALANCE}`:
      return {
        ...state,
        tokenBalance: action.data,
      };

    default:
      return state;
  }
};
