import vendorReducer from '../../../src/reducers/vendorReducer';
import ACTION from '../../../src/actions/vendor';

const initialState = {
	list: [],
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
	aid: '',
	aids: [],
	vendor: {},
	loading: false,
	transactionHistory: []
};

const data = {
	list: [],
	aid: '',
	aids: [],
	vendor: {},
	query: { name: 'Batman', phone: 9856327722 },
	transactionHistory: []
};

describe('Vendor Reducer Tests', () => {
	it('Should verify LIST case of Vendor Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.LIST,
			data: {
				data: data.list,
				total: state.pagination.total,
				limit: state.pagination.limit,
				start: state.pagination.start,
				page: state.pagination.currentPage,
				totalPages: state.pagination.total
			},
			query: {
				name: data.query.name,
				phone: data.query.phone
			}
		};
		const newState = vendorReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			list: action.data.data,
			pagination: {
				...state.pagination
			},
			query: { name: action.data.name, phone: action.data.phone }
		});
	});
	it('Should verify VENDOR_TX case of Vendor Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.VENDOR_TX,
			data: data.transactionHistory
		};
		const newState = vendorReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			transactionHistory: action.data
		});
	});

	it('Should verify LIST_AID case of Vendor Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.LIST_AID,
			data: data.aids
		};
		const newState = vendorReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			aids: action.data.aids
		});
	});
	it('Should verify SET_AID case of Vendor Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.SET_AID,
			data: data.aid
		};
		const newState = vendorReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			aid: action.data
		});
	});
	it('Should verify SET_VENDOR case of Vendor Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.SET_VENDOR,
			data: data.vendor
		};
		const newState = vendorReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			vendor: action.data
		});
	});
	it('Should verify DEFAULT case of Vendor Reducer', () => {
		const state = initialState;
		const action = {
			type: null,
			data: state
		};
		const newState = vendorReducer(state, action);
		expect(newState).toMatchObject({
			...state
		});
	});
});
