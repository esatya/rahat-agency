import ACTION from '../actions/appSettings';

export default (state, action) => {
	let result = action.res;
	switch (action.type) {
		case ACTION.GET_APP_SUCCESS:
			return {
				...state,
				appSettings: result
			};

		case ACTION.SET_PASSCODE_MODAL:
			return { ...state, openPasscodeModal: action.data };

		case ACTION.INIT_APP:
			return {
				...state,
				address: action.data.address,
				network: action.data.network,
				hasWallet: action.data.hasWallet
			};

		case ACTION.SET_LOADING:
			return {
				...state,
				loading: action.data
			};

		case ACTION.SET_WALLET_ACTION_MSG:
			return {
				...state,
				walletActionMsg: action.data
			};

		case ACTION.SET_TEMP_IDENTITY:
			return {
				...state,
				tempIdentity: action.data
			};
		case ACTION.SET_WALLET:
			return {
				...state,
				wallet: action.data
			};

		case ACTION.SET_HASWALLET:
			return {
				...state,
				hasWallet: action.data
			};
		case ACTION.SET_APP_PASSCODE:
			return {
				...state,
				walletPasscode: action.data
			};
		case ACTION.CHANGE_ISVERIFIED:
			return {
				...state,
				isVerified: action.data
			};

		default:
			return state;
	}
};
