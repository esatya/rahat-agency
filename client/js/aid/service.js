import { REST } from 'rumsan-ui';
import config from '../config';

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  add(body) {
    return rest.post({
      path: '/aid',
      body,
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

  get(aidId) {
    return rest.request(`/aid/${aidId}`);
  }

  update(aidId, body) {
    return rest.post({
      path: `/aid/${aidId}`,
      body,
    });
  }

  updateClaimable(aidId, body) {
    // body:{beneficiaryId,claimable
    return rest.post({
      path: `/aid/${aidId}/claimable`,
      body,
    });
  }
}

export default new Service();
