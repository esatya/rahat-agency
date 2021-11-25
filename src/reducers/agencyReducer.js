import ACTION from '../actions/agency';

export default (state, action) => {
	const result = action.res;
	switch (action.type) {
		case `${ACTION.LIST_SUCCESS}`:
			return {
				...state,
				agency: result.data,
				pagination: {
					total: result.total,
					limit: result.limit,
					start: result.start,
					currentPage: result.page,
					totalPages: Math.ceil(result.total / result.limit)
				}
			};

		case `${ACTION.GET_AGENCY_SUCCESS}`:
			return {
				...state,
				agency_details: action.res.agency
			};

		case `${ACTION.DEPLOY_TOKEN_SUCCESS}`:
			return {
				...state,
				agency_details: action.res
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
