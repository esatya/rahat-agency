import config from "../config";
import { REST } from "rumsan-ui";

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  add(body) {
    return rest.post({
      path: `/users`,
      body
    });
  }

  addRole(userId, roles) {
    return rest.post({
      path: `/users/${userId}/roles`,
      body: { roles }
    });
  }

  removeRole(userId, role) {
    return rest.delete({
      path: `/users/${userId}/roles`,
      body: { role }
    });
  }

  get(userId) {
    return rest.request(`/users/${userId}`);
  }

  save(userId, body) {
    return rest.notImplemented("User.save");
    return rest.post({
      path: `/users/${userId}`,
      body
    });
  }

  list() {
    return rest.request("/users?start=0&limit=25");
  }

  changeStatus(userId, is_active) {
    return rest.post({
      path: `/users/${userId}/status`,
      body: { is_active }
    });
  }
}

export default new Service();
