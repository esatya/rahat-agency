import axios from 'axios';
import { getUserToken } from '../utils/sessionManager';
import API from '../constants/api';

const access_token = getUserToken();

export async function listAidConnectBeneficiary(aidConnectId, params) {
	const res = await axios({
		url: API.AID_CONNECT + `/${aidConnectId}/beneficiaries`,
		method: 'get',
		headers: {
			access_token
		},
		params
	});
	return res.data;
}

export async function generateLink(projectId) {
	const res = await axios({
		url: API.PROJECTS + `/${projectId}/aid-connect`,
		method: 'get',
		headers: {
			access_token
		}
	});
	return res.data;
}

export async function changeLinkStatus(projectId, payload) {
	let res = await axios.patch(`${API.PROJECTS}/${projectId}/aid-connect/status`, payload, {
		headers: { access_token }
	});
	return res.data;
}

export async function removeBeneficiary(aidConnectID, beneficiaryId) {
	let res = await axios.delete(`${API.AID_CONNECT}/${aidConnectID}/${beneficiaryId}`, {
		headers: { access_token }
	});
	return res.data;
}

export async function addBeneficiaryInBulk(body) {
	const res = await axios({
		url: `${API.BENEFICARIES}/bulk`,
		method: 'post',
		headers: {
			access_token
		},
		data: body
	});

	return res.data;
}
