import ACTION from '../actions/aidConnect';

export default (state, action) => {
	switch (action.type) {
		case `${ACTION.LIST}`:
			return {
				...state,
				list: action.res.data,
				pagination: {
					limit: parseInt(action.res.limit),
					start: parseInt(action.res.start),
					total: parseInt(action.res.total),
					currentPage: parseInt(action.res.page),
					totalPages: Math.ceil(action.res.total / action.res.limit)
				}
			};

		case `${ACTION.LIST_AID}`:
			return {
				...state,
				projectList: action.data.projectList
			};

		default:
			return state;
	}
};
