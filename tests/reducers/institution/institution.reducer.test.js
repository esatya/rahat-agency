import institutionReducer from '../../../src/reducers/institutionReducer';
import ACTION from '../../../src/actions/institution';

const initialState = {
	institution: [],
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
	institution_details: null,
	loading: false
};
const data = {
	institution: {
		name: 'Rumsan Bank',
		phone: '9779841602388'
	}
};

describe('Institution Reducer Tests', () => {
	it('Should verify LIST_SUCCESS case of Institution Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.LIST_SUCCESS,
			data: {
				data: data.institution,
				total: state.pagination.total,
				limit: state.pagination.limit,
				start: state.pagination.start,
				page: state.pagination.currentPage,
				totalPages: state.pagination.total
			}
		};
		const newState = institutionReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			institution: action.data.data,
			pagination: {
				...state.pagination
			}
		});
	});

	it('Should verify GET_INSTITUTION_SUCCESS case of Institution Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.GET_INSTITUTION_SUCCESS,
			res: {
				institution: data.institution
			}
		};
		const newState = institutionReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			institution_details: action.res.institution
		});
	});
	it('Should verify SET_LOADING case of Institution Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.SET_LOADING,
			res: data.loading
		};
		const newState = institutionReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			loading: true
		});
	});
	it('Should verify RESET_LOADING case of Institution Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.RESET_LOADING,
			res: data.loading
		};
		const newState = institutionReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			loading: false
		});
	});
	it('Should verify DEFAULT case of Institution Reducer', () => {
		const state = initialState;
		const action = {
			type: null,
			res: state
		};
		const newState = institutionReducer(state, action);
		expect(newState).toMatchObject({
			...state
		});
	});
});
