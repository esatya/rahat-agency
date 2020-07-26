import { REST } from 'rumsan-ui';
import config from '../config';

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  add(body) {
    return rest.post({
      path: '/beneficiary',
      body,
    });
  }

  updateClaimable(aidId, body) {
    return rest.post({
      path: `/aid/${aidId}/claimable`,
      body,
    });
  }

  list() {
    return rest.request('/beneficiary?start=0&limit=25');
  }

  get(beneficiaryId) {
    return rest.request(`/beneficiary/${beneficiaryId}`);
  }

  uploadFile(body) {
    return rest.post({
      path: '/beneficiary/upload',
      //  headers: { "content-type": "multipart/form-data" },
      body,
    });
  }

  beneficiaryOnAid(aidId) {
    return rest.request(`/aid/${aidId}/beneficiary`);
  }
}

export default new Service();
