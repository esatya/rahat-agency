import mobilizerReducer from '../../../src/reducers/mobilizerReducer';
import ACTION from '../../../src/actions/mobilizer';

const initialState = {
	list: [],
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
	aid: '',
	aids: [],
	mobilizer: {},
	loading: false,
	transactionHistory: []
};

const data = {
	aid: '',
	aids: [],
	mobilizer: {},
	transactionHistory: [],
	name: 'Rastra',
	phone: '121212122'
};

describe('Mobilizer Reducer Tests', () => {
	it('Should verify LIST case of Mobilizer Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.LIST,
			data: {
				data: data.mobilizer,
				total: state.pagination.total,
				limit: state.pagination.limit,
				start: state.pagination.start,
				page: state.pagination.currentPage,
				totalPages: state.pagination.total,
				query: {
					name: data.name,
					phone: data.phone
				}
			}
		};
		const newState = mobilizerReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			list: action.data.data,
			pagination: {
				...state.pagination
			},
			query: { name: action.data.name, phone: action.data.phone }
		});
	});
	it('Should verify MOBILIZER_TX case of Mobilizer Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.MOBILIZER_TX,
			data: data.transactionHistory
		};
		const newState = mobilizerReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			transactionHistory: action.data
		});
	});
	it('Should verify LIST_AID case of Mobilizer Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.LIST_AID,
			data: data.aids
		};
		const newState = mobilizerReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			aids: action.data.aids
		});
	});
	it('Should verify SET_AID case of Mobilizer Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.SET_AID,
			data: data.aid
		};
		const newState = mobilizerReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			aid: action.data
		});
	});
	it('Should verify SET_MOBILIZER case of Mobilizer Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.SET_MOBILIZER,
			data: data.mobilizer
		};
		const newState = mobilizerReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			mobilizer: action.data
		});
	});
	it('Should verify DEFAULT case of Mobilizer Reducer', () => {
		const state = initialState;
		const action = {
			type: null,
			res: state
		};
		const newState = mobilizerReducer(state, action);
		expect(newState).toMatchObject({
			...state
		});
	});
});
