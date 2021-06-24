import ACTION from "../actions/aid";

export default (state, action) => {
  const result = action.res;
  switch (action.type) {
    case `${ACTION.LIST_AID_SUCCESS}`:
      return {
        ...state,
        aids: result.data,
        pagination: {
          total: result.total,
          limit: result.limit,
          start: result.start,
          currentPage: result.page,
          totalPages: Math.ceil(result.total / result.limit),
        },
      };

    case `${ACTION.VENDORS_LIST_SUCCESS}`:
      return {
        ...state,
        vendors_list: result.data,
        vendor_pagination: {
          total: result.total,
          limit: result.limit,
          start: result.start,
          currentPage: result.page,
          totalPages: Math.ceil(result.total / result.limit),
        },
      };

    case `${ACTION.BENEF_LIST_SUCCSS}`:
      return {
        ...state,
        beneficiary_list: result.data,
        beneficiary_pagination: {
          total: result.total,
          limit: result.limit,
          start: result.start,
          currentPage: result.page,
          totalPages: Math.ceil(result.total / result.limit),
        },
      };

    case ACTION.AVAILABLE_BALANCE:
      return {
        ...state,
        balance: { ...state.balance, available: action.res },
      };

    case ACTION.PROJECT_CAPITAL:
      return {
        ...state,
        balance: { ...state.balance, total: action.res },
      };

    case `${ACTION.GET_BALANCE}`:
      return {
        ...state,
        balance: result,
      };

    case `${ACTION.GET_AID_SUCCESS}`:
      return {
        ...state,
        aid_details: result,
      };

    case `${ACTION.SET_LOADING}`:
      return {
        ...state,
        loading: true,
      };

    case `${ACTION.RESET_LOADING}`:
      return {
        ...state,
        loading: false,
      };

    default:
      return state;
  }
};
