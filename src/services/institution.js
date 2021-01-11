import axios from "axios";
import API from "../constants/api";
import qs from "query-string";

import { getUserToken } from "../utils/sessionManager";

const access_token = getUserToken();

export function get(institutionId) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API.INSTITUTIONS}/${institutionId}`, {
        headers: { access_token: access_token },
      })
      .then((res) => {
        if (res.statusText === "OK") {
          resolve(res.data);
        }
        reject(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function list(query) {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API.INSTITUTIONS}?${qs.stringify(query)}`, {
        headers: { access_token: access_token },
      })
      .then((res) => {
        if (res.statusText === "OK") {
          resolve(res.data);
        }
        reject(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function add(payload) {
  return new Promise((resolve, reject) => {
    axios
      .post(`${API.INSTITUTIONS}`, payload, {
        headers: { access_token: access_token },
      })
      .then((res) => {
        if (res.statusText === "OK") {
          resolve(res.data);
        }
        reject(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

export function update(institutionId, payload) {
  return new Promise((resolve, reject) => {
    axios
      .put(`${API.BANK}/${institutionId}`, payload)
      .then((res) => {
        if (res.statusText === "OK") {
          resolve(res.data);
        }
        reject(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
