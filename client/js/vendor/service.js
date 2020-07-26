import config from "../config";
import { REST } from "rumsan-ui";

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  add(body) {
    console.log("adding");
    return rest.post({
      path: `/vendor`,
      body
    });
  }

  list() {
    return rest.request("/vendor?start=0&limit=25");
  }

  get(beneficiaryId) {
    return rest.request(`/vendor/${beneficiaryId}`);
  }
}

export default new Service();
