import userReducer from '../../../src/reducers/userReducer';
import ACTION from '../../../src/actions/users';

const initialState = {
	user_info: {},
	dashboardStats: null
};

const data = {
	user_info: {}
};

describe('Users Reducer Tests', () => {
	it('Should verify GET case of Users Reducer', () => {
		const state = initialState;
		const action = {
			type: ACTION.GET,
			data: data.user_info
		};
		const newState = userReducer(state, action);
		expect(newState).toMatchObject({
			...state,
			user_info: action.data
		});
	});
	it('Should verify DEFAULT case of Users Reducer', () => {
		const state = initialState;
		const action = {
			type: null,
			data: state
		};
		const newState = userReducer(state, action);
		expect(newState).toMatchObject({
			...state
		});
	});
});
