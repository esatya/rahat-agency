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
			.catch(err => {
				reject(err);
			});
	});
}

export async function setKobotoolbox(payload) {
	const res = await axios({
		url: `${API.APP}/kobotoolbox/setup`,
		method: 'put',
		headers: {
			access_token
		},
		data: payload
	});

	return res.data;
}

export async function getKobotoolboxForms(query) {
	const res = await axios({
		url: `${API.APP}/kobotoolbox`,
		method: 'get',
		headers: {
			access_token
		},
		query
	});
	return res.data;
}

export async function getKoboFormsData(assetId) {
	const res = await axios({
		url: `${API.APP}/kobotoolbox/${assetId}`,
		method: 'get',
		headers: {
			access_token
		}
	});
	return res.data;
}
