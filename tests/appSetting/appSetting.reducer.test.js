import appSettingReducer from '../../src/reducers/appSettingsReducer';
import ACTION from '../../src/actions/appSettings';
import { BALANCE_TABS } from '../../src/constants';

const initialState = {
	settings: {
		activeDir: 'ltr',
		activeThemeLayout: 'vertical',
		activeTheme: 'light',
		activeSidebarType: 'full',
		activeLogoBg: 'skin6',
		activeNavbarBg: 'skin1',
		activeSidebarBg: 'skin6',
		activeSidebarPos: 'fixed',
		activeHeaderPos: 'fixed',
		activeLayout: 'full'
	},
	appSettings: { title: 'App Details' },
	tempIdentity: '',
	wallet: null,
	hasWallet: false,
	walletPasscode: null,
	isVerified: false,
	loading: false,
	openPasscodeModal: false,
	walletActionMsg: null,
	pagination: { limit: 10, start: 0, total: 0, currentPage: 1, totalPages: 0 },
	currentBalanceTab: BALANCE_TABS.TOKEN
};

const data = {
	appSettings: { title: 'App Details' },
	openPasscodeModal: false,
	address: '0x189E22f7Abd56c46C7e00C01d08f1Da413778A7d',
	network: null,
	hasWallet: false,
	loading: false,
	currentBalanceTab: BALANCE_TABS.TOKEN,
	walletActionMsg: null,
	tempIdentity: '',
	wallet: null,
	walletPasscode: null,
	isVerified: false
};

describe('AppSettings Reducer Tests', () => {
	describe('Reducer', () => {
		it('Should verify GET_APP_SUCCESS case of AppSettings Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.GET_APP_SUCCESS,
				res: data.appSettings
			};
			const newState = appSettingReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				appSettings: action.res
			});
		});
		it('Should verify SET_PASSCODE_MODAL case of AppSettings Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.SET_PASSCODE_MODAL,
				data: data.openPasscodeModal
			};
			const newState = appSettingReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				openPasscodeModal: action.data
			});
		});
		it('Should verify INIT_APP case of AppSettings Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.INIT_APP,
				data: {
					...state,
					address: data.address,
					network: data.network,
					hasWallet: data.hasWallet
				}
			};
			const newState = appSettingReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				address: action.data.address,
				network: action.data.network,
				hasWallet: action.data.hasWallet
			});
		});
		it('Should verify SET_LOADING case of AppSettings Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.SET_LOADING,
				data: data.loading
			};
			const newState = appSettingReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				loading: action.data
			});
		});
		it('Should verify SET_BALANCE__CURRENT_TAB case of AppSettings Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.SET_BALANCE__CURRENT_TAB,
				data: data.currentBalanceTab
			};
			const newState = appSettingReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				currentBalanceTab: action.data
			});
		});
		it('Should verify SET_WALLET_ACTION_MSG case of AppSettings Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.SET_WALLET_ACTION_MSG,
				data: data.walletActionMsg
			};
			const newState = appSettingReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				walletActionMsg: action.data
			});
		});
		it('Should verify SET_TEMP_IDENTITY case of AppSettings Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.SET_TEMP_IDENTITY,
				data: data.tempIdentity
			};
			const newState = appSettingReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				tempIdentity: action.data
			});
		});
		it('Should verify SET_WALLET case of AppSettings Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.SET_WALLET,
				data: data.wallet
			};
			const newState = appSettingReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				wallet: action.data
			});
		});
		it('Should verify SET_HASWALLET case of AppSettings Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.SET_HASWALLET,
				data: data.hasWallet
			};
			const newState = appSettingReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				hasWallet: action.data
			});
		});
		it('Should verify SET_APP_PASSCODE case of AppSettings Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.SET_APP_PASSCODE,
				data: data.walletPasscode
			};
			const newState = appSettingReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				walletPasscode: action.data
			});
		});
		it('Should verify CHANGE_ISVERIFIED case of AppSettings Reducer', () => {
			const state = initialState;
			const action = {
				type: ACTION.CHANGE_ISVERIFIED,
				data: data.isVerified
			};
			const newState = appSettingReducer(state, action);
			expect(newState).toMatchObject({
				...state,
				isVerified: action.data
			});
		});
		it('Should verify DEFAULT case of AppSettings Reducer', () => {
			const state = initialState;
			const action = {
				type: null,
				res: state
			};
			const newState = appSettingReducer(state, action);
			expect(newState).toMatchObject({
				...state
			});
		});
	});
});
