import projectReducer from '../../src/reducers/aidReducer';

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
	aid_details: null,
	total_tokens: 0,
	available_tokens: 0,
	loading: false
};

const aids = ['Flood aid distribution', 'Earthquake relief', 'Landslide relief'];
const aid_details = {
	name: 'aqua water',
	location: 'ktm'
};
const beneficiary_list = ['John Doe', 'Amanda Cerny', 'David Taylor'];

describe('Aid Reducer Tests', () => {
	describe('Reducer', () => {
		it('Should verify LIST_AID_SUCCESS case of Aid Reducer', () => {
			const state = initialState;
			const newState = projectReducer(state, {
				type: 'LIST_AID_SUCCESS',
				res: { data: aids, total: 0, limit: 10, start: 0, page: 1, totalPages: 0 }
			});
			expect(newState).toMatchObject({
				aids: ['Flood aid distribution', 'Earthquake relief', 'Landslide relief'],
				pagination: { total: 0, limit: 10, start: 0, currentPage: 1, totalPages: 0 },
				aid_details: null,
				loading: false
			});
		});
		// it('Should verify BENEF_LIST_SUCCSS case of Aid Reducer', () => {
		// 	const state = initialState;
		// 	const newState = projectReducer(state, {
		// 		type: 'BENEF_LIST_SUCCSS',
		// 		res: {
		// 			data: beneficiary_list,
		// 			total: 0,
		// 			limit: 10,
		// 			start: 0,
		// 			page: 1,
		// 			totalPages: 0
		// 		}
		// 	});

		// 	expect(newState).toMatchObject({
		// 		beneficiary_list: ['John Doe', 'Amanda Cerny', 'David Taylor'],
		// 		beneficiary_pagination: {
		// 			total: 0,
		// 			limit: 10,
		// 			start: 0,
		// 			currentPage: 1,
		// 			totalPages: 0
		// 		},
		// 		loading: false
		// 	});
		// });
		it('Should verify SET_TOTAL_TOKENS case of Aid Reducer', () => {
			const state = initialState;
			const newState = projectReducer(state, {
				type: 'SET_TOTAL_TOKENS',
				res: 0
			});
			expect(newState).toMatchObject({
				total_tokens: 0
			});
		});
		it('Should verify SET_AVAILABLE_TOKENS case of Aid Reducer', () => {
			const state = initialState;
			const newState = projectReducer(state, {
				type: 'SET_AVAILABLE_TOKENS',
				res: 0
			});
			expect(newState).toMatchObject({
				available_tokens: 0
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
	});
});
