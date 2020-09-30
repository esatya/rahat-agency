import API from "../constants/api";
import axios from "axios";

export function getSettings() {
  return new Promise((resolve, reject) => {
    axios
      .get(`${API.APP}/settings`)
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
