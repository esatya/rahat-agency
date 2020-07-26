import { TablePanel, Notify } from 'rumsan-ui';
import config from '../config';

class ListPanel extends TablePanel {
  constructor(cfg) {
    cfg.url = `${config.apiPath}/agency`;
    super(cfg);
    this.instance = cfg.instance;
    this.registerEvents('approve-agency', 'check-agency');
    this.render();
  }

  setColumns() {
    return [
      { data: 'name' },
      { data: 'eth_address' },
      {
        data: null,
        render: (d) => {
          console.log(d);
          if (d.token || d.token.onChain) return d.token.name;
          return "<span style='color: #ff0000;'>NOT DEPLOYED</span>";
        },
      },
      {
        data: null,
        render: (d) => d.aids.length,
      },
      // {
      //   data: null,
      //   render: d => {
      //     if (d.eth_address) {
      //       d.target = this.target;
      //       let ridx = this.getRowByValue();
      //       let cidx = 4;
      //       d.ridx = ridx;
      //       d.cidx = cidx;
      //       console.log("index", ridx);
      //       this.fire("check-agency", d);
      //     }
      //     return `<a href="#"><i style='color: #ff0000;' class="fa fa-times"></i> </a>`;
      //   }
      // },
      {
        data: null,
        render: (d) => {
          if (d.approve) {
            return '<span style=\'color: #03a130;\'>Approved</span>';
          }
          return '<span style=\'color: #ff0000;\'>Pending Approval</span>';
        },
      },
      {
        data: null,

        render: (d) => `
           
            <a href='/agency/${d._id}' title='Edit Agency'><i class='fa fa-pencil'></i></a>&nbsp;&nbsp;
            `,
      },
    ];
  }
}

export default ListPanel;
