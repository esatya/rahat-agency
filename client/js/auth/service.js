import config from "../config";
import { REST, Session } from "rumsan-ui";

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  async login(body) {
    return rest.post({
      url: `/login`,
      useAccessToken: false,
      body
    });
  }

  async metamaskLogin(body) {
    return rest.post({
      url: `/auth/metamask`,
      useAccessToken: false,
      body
    });
  }

  async getNonce(body) {
    return rest.post({
      url: `/nonce`,
      useAccessToken: false,
      body
    });
  }

  async getData() {
    return rest.get({ url: "/auth" });
  }

  forgetPassword(body) {
    return rest.post({
      path: `/users/password_forgot`,
      useAccessToken: false,
      body
    });
  }
}

export default new Service();
