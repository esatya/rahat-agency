import config from "../config";
import { REST } from "rumsan-ui";

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  listPermissions() {
    return rest.get("/static/permissions");
  }

  get(id) {
    return rest.get(`/roles/${id}`);
  }

  add(body) {
    return rest.post({
      path: `/roles`,
      body
    });
  }

  remove(id) {
    return rest.delete("/roles/" + id);
  }

  removePermissions(roleId, permissions) {
    return rest.delete({
      path: `/roles/${roleId}/permissions`,
      body: {
        permissions
      }
    });
  }

  addPermissions(roleId, permissions) {
    return rest.post({
      path: `/roles/${roleId}/permissions`,
      body: {
        permissions
      }
    });
  }
}

export default new Service();
