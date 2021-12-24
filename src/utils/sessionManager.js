import DexieService from '../services/db';

export function getUser() {
	if (localStorage.getItem('currentUser') && Object.keys(localStorage.getItem('currentUser')).length) {
		return JSON.parse(localStorage.getItem('currentUser'));
	}
	return null;
}

export function saveUser(userData) {
	localStorage.setItem('currentUser', JSON.stringify(userData));
}

export function saveAppSettings(appData) {
	localStorage.setItem('appSettings', JSON.stringify(appData));
}

export function getAppSettings() {
	if (localStorage.getItem('appSettings') && Object.keys(localStorage.getItem('appSettings')).length) {
		return JSON.parse(localStorage.getItem('appSettings'));
	}
	return null;
}

export function saveUserToken(token) {
	localStorage.setItem('token', token);
}

export function saveUserPermissions(perms) {
	localStorage.setItem('userPermissions', perms);
}

export function getUserPermissions() {
	if (localStorage.getItem('userPermissions') && Object.keys(localStorage.getItem('userPermissions')).length) {
		return JSON.parse(localStorage.getItem('userPermissions'));
	}
	return [];
}

export async function logoutUser() {
	localStorage.clear();
	await DexieService.clearAll();
	window.location = '/auth/wallet';
}

export function getUserToken() {
	return localStorage.getItem('token');
}
