import {
	getUser,
	saveUser,
	saveAppSettings,
	getAppSettings,
	saveUserToken,
	saveUserPermissions,
	getUserPermissions,
	logoutUser,
	getUserToken
} from '../../../src/utils/sessionManager';
import 'regenerator-runtime/runtime';

describe('Testing session manager', () => {
	it('get null value if user is not saved', () => {
		getUser();
		const savedUser = localStorage.getItem('currentUser');
		expect(savedUser).toEqual(null);
	});
	it('save user', () => {
		const userData = {
			name: 'esatya',
			phone: '1231231232'
		};
		saveUser(userData);
		const savedUser = localStorage.getItem('currentUser');
		expect(savedUser).toEqual('{"name":"esatya","phone":"1231231232"}');
	});
	it('get user if user is saved', () => {
		getUser();
		const savedUser = localStorage.getItem('currentUser');
		expect(savedUser).toEqual('{"name":"esatya","phone":"1231231232"}');
	});
	it('get null value if app settings are saved ', () => {
		getAppSettings();
		const GetAppSettings = localStorage.getItem('appSettings');
		expect(GetAppSettings).toEqual(null);
	});
	it('save app settings', () => {
		const appData = {
			name: 'profile',
			phone: '9876543'
		};
		saveAppSettings(appData);
		const savedAppSettings = localStorage.getItem('appSettings');
		expect(savedAppSettings).toEqual('{"name":"profile","phone":"9876543"}');
	});
	it('get app settings if app settings are saved ', () => {
		getAppSettings();
		const GetAppSettings = localStorage.getItem('appSettings');
		expect(GetAppSettings).toEqual('{"name":"profile","phone":"9876543"}');
	});
	it('save user token', () => {
		const token = 'x8000';
		saveUserToken(token);
		const savedUserToken = localStorage.getItem('token');
		expect(savedUserToken).toEqual('x8000');
	});
	it('get null value if user permissions are not saved', () => {
		getUserPermissions();
		const GetUserPermissions = localStorage.getItem('userPermissions');
		expect(GetUserPermissions).toEqual(null);
	});
	it('save user permissions', () => {
		const perms = {
			role: 'Admin'
		};
		saveUserPermissions(JSON.stringify(perms));
		const savedUserPermissions = localStorage.getItem('userPermissions');
		expect(savedUserPermissions).toEqual('{"role":"Admin"}');
	});
	it('get user permissions if its saved', () => {
		getUserPermissions();
		const GetUserPermissions = localStorage.getItem('userPermissions');
		expect(GetUserPermissions).toEqual('{"role":"Admin"}');
	});
	it('get user token', () => {
		getUserToken();
		const GetUserToken = localStorage.getItem('token');
		expect(GetUserToken).toEqual('x8000');
	});
	it('logout user', async () => {
		await logoutUser();
		const logout = localStorage.getItem('token');
		expect(logout).toEqual(null);
	});
});
