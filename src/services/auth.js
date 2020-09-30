import API from "../constants/api";
import axios from "axios";

import { getUserToken } from "../utils/sessionManager";
const access_token = getUserToken();

export async function pat(body) {
  const { data } = await axios({
    url: API.PAT,
    method: "post",
    headers: {
      access_token,
    },
    data: body,
  });
  return data;
}
