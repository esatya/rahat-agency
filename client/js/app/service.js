import { REST } from 'rumsan-ui';
import config from '../config';

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  verify(body) {
    console.log('verifyin', body);
    return rest.post({
      path: '/app/verify',
      body,
    });
  }
}

export default new Service();
