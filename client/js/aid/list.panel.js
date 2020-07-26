import { TablePanel, Notify } from 'rumsan-ui';
import config from '../config';

class ListPanel extends TablePanel {
  constructor(cfg) {
    cfg.url = `${config.apiPath}/aid`;
    super(cfg);
    this.registerEvents('deploy-contract');

    this.render();
  }

  setColumns() {
    return [
      { data: 'name' },
      { data: 'eth_address' },

      {
        data: null,
        render: (d) => d.beneficiaries.length,
      },
      {
        data: null,
        render: (d) => d.vendors.length,
      },
      {
        data: null,
        render: (d) => {
          if (d.eth_address != '0x0') {
            return `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button class="btn btn-info btn-circle btn" title="Deployed" type="button"><i class="fa fa-check"></i>
            </button>`;
          }
          return `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button onclick="$('${this.target}').trigger('deploy-contract', {name: '${d.name}',id:'${d._id}'})" 
            class="btn btn-success btn-circle btn" title="Deploy contract" type="button"><i class="fa fa-link"></i>
            </button>`;
        },
      },
      {
        data: null,
        class: 'text-center',
        render(data, type, full, meta) {
          return `&nbsp;&nbsp;
        <a href='/aid/${data._id}' title='Edit Aid'><i class='fa fa-pencil'></i></a>&nbsp;&nbsp;`;
        },
      },
    ];
  }
}

export default ListPanel;
