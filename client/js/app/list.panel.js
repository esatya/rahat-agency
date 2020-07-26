import { TablePanel, Notify } from 'rumsan-ui';
import config from '../config';

class ListProject extends TablePanel {
  constructor(cfg) {
    cfg.url = `${config.apiPath}/aid/projects`;

    super(cfg);
    this.instance = cfg.instance;
    this.registerEvents('verify-address');
    this.render();
  }

  setColumns() {
    return [
      {
        data: null,
        render: (d) => 1,
      },
      { data: 'name' },
      { data: 'host' },
      {
        data: 'token_address',
      },
      {
        data: null,
        class: 'text-center',
        render: (data) => `&nbsp;&nbsp;
        <a onclick="$('${this.target}').trigger('verify-address', {eth_address: '${data.eth_address}'})"  title='project'><i class='fa fa-pencil'></i></a>&nbsp;&nbsp;`,
      },
    ];
  }

  async tokenAddress(user_address) {
    try {
      const tokenAddress = await this.instance.methods.tokens(user_address).call();
      return tokenAddress;
    } catch (e) {
      console.error(e);
    }
  }
}

export default ListProject;
