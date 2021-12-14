import agencyReducer from '../../src/reducers/agencyReducer';
import ACTION from '../../src/actions/agency';

const initialState = {
	agency: [],
	pagination: { total: 0, limit: 20, start: 0, currentPage: 1, totalPages: 0 },
	agency_details: null,
	loading: false
};

const data = {
	agency: {
		name: 'eSatya',
		phone: '1231231232'
	}
};

describe('Agency Reducer Tests', () => {
	describe('Reducer', () => {
		it('Should verify LIST_SUCCESS case of Agency Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.LIST_SUCCESS,
				res: {
					data: data.agency,
					total: state.pagination.total,
					limit: state.pagination.limit,
					start: state.pagination.start,
					page: state.pagination.currentPage,
					totalPages: state.pagination.total
				}
			};
			const newState = agencyReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				agency: action.res.data,
				pagination: {
					...state.pagination
				}
			});
		});
		it('Should verify GET_AGENCY_SUCCESS case of Agency Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.GET_AGENCY_SUCCESS,
				res: {
					agency: data.agency
				}
			};
			const newState = agencyReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				agency_details: action.res.agency
			});
		});
		it('Should verify DEPLOY_TOKEN_SUCCESS case of Agency Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.DEPLOY_TOKEN_SUCCESS,
				res: data.agency
			};
			const newState = agencyReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				agency_details: action.res
			});
		});
		it('Should verify SET_LOADING case of Agency Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.SET_LOADING,
				res: data.loading
			};
			const newState = agencyReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				loading: true
			});
		});
		it('Should verify RESET_LOADING case of Agency Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.RESET_LOADING,
				res: data.loading
			};
			const newState = agencyReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				loading: false
			});
		});
		it('Should verify DEFAULT case of Agency Reducer', () => {
			const state = initialState;
			const action = {
				type: null,
				res: state
			};
			const newState = agencyReducer(state, action);
			expect(newState).toMatchObject({
				...state
			});
		});
	});
});
