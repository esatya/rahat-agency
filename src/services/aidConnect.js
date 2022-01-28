import axios from 'axios';
import { getUserToken } from '../utils/sessionManager';
import API from '../constants/api';

const access_token = getUserToken();

export async function listBeneficiary(params) {
	const res = await axios({
		url: API.BENEFICARIES,
		method: 'get',
		headers: {
			access_token
		},
		params
	});
	return res.data;
}

export async function listByAid(aid, params) {
	const res = await axios({
		url: API.PROJECTS + `/${aid}/beneficiaries`,
		method: 'get',
		headers: {
			access_token
		},
		params
	});
	return res.data;
}

// export async function changeLinkStatus(aidId, status) {
// 	let res = await axios.patch(
// 		`${API.PROJECTS}/${aidId}/status`,
// 		{ status },
// 		{
// 			headers: { access_token }
// 		}
// 	);
// 	return res.data;
// }
