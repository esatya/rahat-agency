import API from '../constants/api';
import axios from 'axios';
import { getUserToken } from '../utils/sessionManager';

const access_token = getUserToken();

export function getSettings() {
	return new Promise((resolve, reject) => {
		axios
			.get(`${API.APP}/settings`)
			.then(res => {
				resolve(res.data);
			})
			.catch(() => {
				reject({ statusText: 'FAIL', data: {} });
			});
	});
}
export async function setKobotoolbox(payload) {
	return new Promise((resolve, reject) => {
		axios
			.put(`${API.APP}/kobotoolbox/setup`, { data: payload }, { headers: { access_token: access_token } })
			.then(res => {
				if (res && res.data) {
					resolve(res.data);
				}
				reject(res.data);
			})
			.catch(() => {
				reject({ statusText: 'FAIL', data: {} });
			});
	});
}
export async function getKobotoolboxForms(query) {
	return new Promise((resolve, reject) => {
		axios
			.get(`${API.APP}/kobotoolbox`, {
				headers: { access_token: access_token },
				query
			})
			.then(res => {
				if (res && res.data) {
					resolve(res.data);
				}
				reject(res.data);
			})
			.catch(() => {
				reject({ statusText: 'FAIL', data: {} });
			});
	});
}
export async function getKoboFormsData(assetId) {
	return new Promise((resolve, reject) => {
		axios
			.get(`${API.APP}/kobotoolbox/${assetId}`, {
				headers: { access_token: access_token }
			})
			.then(res => {
				if (res && res.data) {
					resolve(res.data);
				}
				reject(res.data);
			})
			.catch(() => {
				reject({ statusText: 'FAIL', data: {} });
			});
	});
}
