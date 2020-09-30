import API from "../constants/api";
import axios from "axios";
import { getUserToken } from "../utils/sessionManager";

const access_token = getUserToken();

export async function list(params) {
  const { data } = await axios({
    url: API.ONBOARD,
    method: "get",
    headers: {
      access_token,
    },
    params,
  });
  return data;
}

export async function issue(id, body) {
  const { data } = await axios({
    url: API.ONBOARD + "/me",
    method: "patch",
    headers: {
      access_token,
    },
    data: body,
  });
  return data;
}
