import beneficiaryReducer from '../../../src/reducers/beneficiaryReducer';
import ACTION from '../../../src/actions/beneficiary';

const initialState = {
	list: [],
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
	aid: {},
	projectList: [],
	beneficiary: {},
	tokenBalance: 0
};

const data = {
	list: {
		name: 'Joe Rogan',
		phone: 9840392134
	},
	projectList: ['Batman', 'Spiderman', 'Flash'],
	aid: {
		name: 'Earthquake relief',
		location: 'Gorkha'
	},
	beneficiary: {
		name: 'C Ronaldo',
		phone: 9999
	},
	tokenBalance: 0
};

describe('Beneficiary Reducer Tests', () => {
	it('Should verify LIST case of Beneficiary Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.LIST,
			res: {
				data: data.list,
				limit: state.pagination.limit,
				start: state.pagination.start,
				total: state.pagination.total,
				page: state.pagination.currentPage,
				totalPages: state.pagination.totalPages
			}
		};

		const newState = beneficiaryReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			list: action.res.data,
			pagination: {
				...state.pagination
			}
		});
	});
	it('Should verify LIST_AID case of Beneficiary Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.LIST_AID,
			data: data.projectList
		};
		const newState = beneficiaryReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			projectList: action.data.projectList
		});
	});
	it('Should verify SET_AID case of Beneficiary Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.SET_AID,
			data: data.aid
		};
		const newState = beneficiaryReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			aid: action.data
		});
	});
	it('Should verify SET_BENEFICIARY case of Beneficiary Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.SET_BENEFICIARY,
			data: data.beneficiary
		};
		const newState = beneficiaryReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			beneficiary: action.data
		});
	});
	it('Should verify SET_TOKEN_BALANCE case of Beneficiary Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.SET_TOKEN_BALANCE,
			data: data.tokenBalance
		};
		const newState = beneficiaryReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			tokenBalance: action.data
		});
	});
	it('Should verify DEFAULT case of Beneficiary Reducer', () => {
		const state = initialState;
		const action = {
			type: null,
			res: state
		};
		const newState = beneficiaryReducer(state, action);
		expect(newState).toMatchObject({
			...state
		});
	});
});
