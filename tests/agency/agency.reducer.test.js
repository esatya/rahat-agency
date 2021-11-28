import agencyReducer from '../../src/reducers/agencyReducer';

const initialState = {
	agency: [],
	pagination: { total: 0, limit: 20, start: 0, currentPage: 1, totalPages: 0 },
	agency_details: null,
	loading: false
};

const agency = ['a', 'b', 'c'];
const agency_details = {
	name: 'eSatya',
	phone: '1231231232'
};

describe('Agency Reducer Tests', () => {
	describe('Reducer', () => {
		it('Should verify LIST_SUCCESS case of Agency Reducer', () => {
			const state = initialState;
			const newState = agencyReducer(state, {
				type: 'LIST_SUCCESS',
				res: { data: agency, total: 0, limit: 20, start: 0, page: 1, totalPages: 0 }
			});
			expect(newState).toMatchObject({
				agency: ['a', 'b', 'c'],
				pagination: { total: 0, limit: 20, start: 0, currentPage: 1, totalPages: 0 },
				agency_details: null,
				loading: false
			});
		});
		it('Should verify GET_AGENCY_SUCCESS case of Agency Reducer', () => {
			const state = initialState;
			const newState = agencyReducer(state, {
				type: 'GET_AGENCY_SUCCESS',
				res: { data: agency_details }
			});
			console.log(newState);
			expect(newState).toMatchObject({
				agency_details: {
					name: 'eSatya',
					phone: '1231231232'
				}
			});
		});
	});
});
