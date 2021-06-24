import ACTION from "../actions/institution";

export default (state, action) => {
  const result = action.data;
  switch (action.type) {
    case `${ACTION.LIST_SUCCESS}`:
      return {
        ...state,
        institution: result.data,
        pagination: {
          total: parseInt(result.total),
          limit: parseInt(result.limit),
          start: parseInt(result.start),
          currentPage: parseInt(result.page),
          totalPages: Math.ceil(result.total / result.limit),
        },
      };

    case `${ACTION.GET_INSTITUTION_SUCCESS}`:
      return {
        ...state,
        institution_details: action.res.institution,
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
