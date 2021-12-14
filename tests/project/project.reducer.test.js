import projectReducer from '../../src/reducers/aidReducer';
import ACTION from '../../src/actions/aid';

const initialState = {
	aids: [],
	pagination: { total: 0, limit: 10, start: 0, currentPage: 1, totalPages: 0 },
	beneficiary_list: [],
	beneficiary_pagination: {
		total: 0,
		limit: 10,
		start: 0,
		currentPage: 1,
		totalPages: 0
	},
	vendors_list: [],
	vendor_pagination: {
		total: 0,
		limit: 10,
		start: 0,
		currentPage: 1,
		totalPages: 0
	},
	aid_details: null,
	total_tokens: 0,
	available_tokens: 0,
	loading: false
};

const data = {
	aid_details: {
		name: 'aqua water',
		location: 'ktm'
	},
	beneficiary_list: {
		name: 'David Taylor',
		phone: '9808786543'
	},
	available_tokens: 0,
	total_tokens: 0
};

describe('Aid Reducer Tests', () => {
	describe('Reducer', () => {
		it('Should verify LIST_AID_SUCCESS case of Aid Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.LIST_AID_SUCCESS,
				res: {
					data: data.aids,
					total: state.pagination.total,
					limit: state.pagination.limit,
					start: state.pagination.start,
					page: state.pagination.currentPage,
					totalPages: state.pagination.total
				}
			};
			const newState = projectReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				aids: action.res.data,
				pagination: {
					...state.pagination
				}
			});
		});
		it('Should verify VENDORS_LIST_SUCCESS case of Aid Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.VENDORS_LIST_SUCCESS,
				res: {
					data: data.vendors_list,
					total: state.vendor_pagination.total,
					limit: state.vendor_pagination.limit,
					start: state.vendor_pagination.start,
					page: state.vendor_pagination.currentPage,
					totalPages: state.vendor_pagination.totalPages
				}
			};
			const newState = projectReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				vendors_list: action.res.data,
				vendor_pagination: {
					...state.vendor_pagination
				}
			});
		});
		it('Should verify BENEF_LIST_SUCCSS case of Aid Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.BENEF_LIST_SUCCSS,
				res: {
					data: data.beneficiary_list,
					total: state.beneficiary_pagination.total,
					limit: state.beneficiary_pagination.limit,
					start: state.beneficiary_pagination.start,
					page: state.beneficiary_pagination.currentPage,
					totalPages: state.beneficiary_pagination.totalPages
				}
			};
			const newState = projectReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				beneficiary_list: action.res.data,
				beneficiary_pagination: {
					...state.beneficiary_pagination
				}
			});
		});
		it('Should verify SET_AVAILABLE_TOKENS case of Aid Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.SET_AVAILABLE_TOKENS,
				res: data.available_tokens
			};
			const newState = projectReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				available_tokens: action.res
			});
		});
		it('Should verify SET_TOTAL_TOKENS case of Aid Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.SET_TOTAL_TOKENS,
				res: data.total_tokens
			};
			const newState = projectReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				total_tokens: action.res
			});
		});

		it('Should verify GET_AID_SUCCESS case of Aid Reducer', () => {
			const state = initialState;
			const newState = projectReducer(state, {
				type: 'GET_AID_SUCCESS',
				res: { name: 'aqua water', location: 'ktm' }
			});
			expect(newState).toMatchObject({
				aid_details: {
					name: 'aqua water',
					location: 'ktm'
				}
			});
		});
		it('Should verify SET_LOADING case of Aid Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.SET_LOADING,
				res: data.loading
			};
			const newState = projectReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				loading: true
			});
		});
		it('Should verify RESET_LOADING case of Aid Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.RESET_LOADING,
				res: data.loading
			};
			const newState = projectReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				loading: false
			});
		});
		it('Should verify DEFAULT case of Aid Reducer', () => {
			const state = initialState;
			const action = {
				type: null,
				res: state
			};
			const newState = projectReducer(state, action);
			expect(newState).toMatchObject({
				...state
			});
		});
	});
});
