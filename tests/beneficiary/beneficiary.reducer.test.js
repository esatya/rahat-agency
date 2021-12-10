import beneficiaryReducer from '../../src/reducers/beneficiaryReducer';

const initialState = {
	list: [],
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
	aid: {},
	projectList: [],
	beneficiary: {},
	tokenBalance: 0
};

const list = ['Joe Rogan', 'Amanda Cerny', 'Leo Messi'];
const projectList = ['Batman', 'Spiderman', 'Flash'];
const aid = {
	name: 'Earthquake relief',
	location: 'Gorkha'
};
const beneficiary = {
	name: 'C Ronaldo',
	phone: 9999
};

describe('Beneficiary Reducer Tests', () => {
	describe('Reducer', () => {
		// it('Should verify LIST case of Beneficiary Reducer', () => {
		// 	const state = initialState;
		// 	const newState = beneficiaryReducer(state, {
		// 		type: 'LIST',
		// 		res: { data: list, limit: 10, start: 0, total: 0, page: 1, totalPages: 0 }
		// 	});
		// 	expect(newState).toMatchObject({
		// 		list: ['Joe Rogan', 'Amanda Cerny', 'Leo Messi'],
		// 		pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 }
		// 	});
		// });
		it('Should verify SET_TOKEN_BALANCE case of Beneficiary Reducer', () => {
			const state = initialState;
			const newState = beneficiaryReducer(state, {
				type: 'SET_TOKEN_BALANCE',
				data: 0
			});
			expect(newState).toMatchObject({
				tokenBalance: 0
			});
		});
		it('Should verify SET_AID case of Beneficiary Reducer', () => {
			const state = initialState;
			const newState = beneficiaryReducer(state, {
				type: 'SET_AID',
				data: aid
			});
			expect(newState).toMatchObject({
				aid: {
					name: 'Earthquake relief',
					location: 'Gorkha'
				}
			});
		});
		it('Should verify SET_BENEFICIARY case of Beneficiary Reducer', () => {
			const state = initialState;
			const newState = beneficiaryReducer(state, {
				type: 'SET_BENEFICIARY',
				data: beneficiary
			});
			expect(newState).toMatchObject({
				beneficiary: {
					name: 'C Ronaldo',
					phone: 9999
				}
			});
		});
		it('Should verify LIST_AID case of Beneficiary Reducer', () => {
			const state = initialState;
			const newState = beneficiaryReducer(state, {
				type: 'LIST_AID',
				data: { projectList }
			});
			expect(newState).toMatchObject({
				projectList: ['Batman', 'Spiderman', 'Flash']
			});
		});
	});
});
