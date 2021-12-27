import API from '../constants/api';
import axios from 'axios';
import { getUserToken } from '../utils/sessionManager';

const access_token = getUserToken();

// export async function list(params) {
//   const { data } = await axios({
//     url: API.ONBOARD,
//     method: "get",
//     headers: {
//       access_token,
//     },
//     params,
//   });
//   return data;
// }

export function list(params) {
	return new Promise((resolve, reject) => {
		axios
			.get(`${API.ONBOARD}`, params, {
				headers: { access_token: access_token }
			})
			.then(res => {
				if (res && res.data) {
					resolve(res.data);
				}
				reject(res.data);
			})
			.catch(err => {
				reject({ statusText: 'FAIL', data: {} });
			});
	});
}

// export async function issue(id, body) {
// 	const { data } = await axios({
// 		url: API.ONBOARD + '/me',
// 		method: 'patch',
// 		headers: {
// 			access_token
// 		},
// 		data: body
// 	});
// 	return data;
// }

export function issue(id, body) {
	return new Promise((resolve, reject) => {
		axios
			.patch(
				`${API.ONBOARD}/me`,
				{ data: body },
				{
					headers: { access_token: access_token }
				}
			)
			.then(res => {
				if (res && res.data) {
					resolve(res.data);
				}
				reject(res.data);
			})
			.catch(err => {
				reject({ statusText: 'FAIL', data: {} });
			});
	});
}
