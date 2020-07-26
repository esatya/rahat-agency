import { REST } from 'rumsan-ui';
import config from '../config';

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  add(body) {
    return rest.post({
      path: '/agency',
      body,
    });
  }

  register(body) {
    return rest.post({
      path: '/agency/register',
      body,
    });
  }

  approve(agencyId) {
    return rest.post({
      path: `/agency/${agencyId}/approve`,
    });
  }

  addToken(body) {
    return rest.post({
      path: `/agency/${agencyId}/token`,
      body,
    });
  }

  list() {
    return rest.request('/agency?start=0&limit=25');
  }

  get(agencyId) {
    return rest.request(`/agency/${agencyId}`);
  }

  addTx(body) {
    return rest.post({
      path: '/transactions',
      body,
    });
  }
}

export default new Service();
