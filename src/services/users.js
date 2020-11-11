import API from '../constants/api';
import axios from 'axios';
import {
  saveUser,
  saveUserToken,
  saveUserPermissions,
  getUserToken,
} from '../utils/sessionManager';

const access_token = getUserToken();

export async function dashboardStats() {
  let res = await axios.get(`${API.APP}/dashboards`, {
    headers: { access_token },
  });
  return res.data;
}

export function verifyToken(token) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API.TOKEN_AUTH}?access_token=${token}`)
      .then((res) => {
        if (res.data && res.data.user) {
          saveUser(res.data.user);
          saveUserToken(token);
          saveUserPermissions(res.data.permissions);
          resolve({ sucess: true, status: 200 });
        }
        resolve({
          success: false,
          status: 500,
        });
      })
      .catch((err) => {
        reject(err.response.data);
      });
  });
}

export function loginUsingMetamask(payload) {
  return new Promise((resolve, reject) => {
    axios
      .post(API.METAMASK_LOGIN, payload)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.response.data);
      });
  });
}
