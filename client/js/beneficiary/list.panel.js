import { TablePanel, Session, Notify } from 'rumsan-ui';
import config from '../config';
import Services from './service';
import AddBeneficiary from './add.modal';

class ListPanel extends TablePanel {
  constructor(cfg) {
    cfg.url = `${config.apiPath}/beneficiary`;
    super(cfg);
    this.cfg = cfg;
    this.instance = cfg.instance;
    this.registerEvents('aid-selected', 'issue-token');
    this.renderAidSelector();
    this.render();
  }

  setColumns() {
    return [
      { data: 'name' },
      { data: 'phone' },
      { data: 'email' },
      { data: 'address' },
      {
        data: null,
        render: (d) => {
          try {
            if (d.claimable) { return d.claimable; }

            return 'N/A';
          } catch (e) {
            console.log(e);
            return e;
          }
        },
      },
      {
        data: null,
        class: 'text-center',
        render: (d) => `&nbsp;&nbsp;
          <button onclick="$('${this.target}').trigger('issue-token', {phone: '${d.phone}',id:'${d._id}'})" class="btn btn-primary dim" type="button"><i class="fa fa-money"></i></button>`,
      },

    ];
  }

  renderAidSelector() {
    const defaultOption = { _id: null, name: 'All Beneficiary', eth_address: '0x' };

    $('#be_aid_select').select2({
      width: '100%',
      placeholder: 'All Beneficiary',
      ajax: {
        url: `${config.apiPath}/aid`,
        headers: Session.getToken(),
        dataType: 'json',
        data(params) {
          const query = {
            name: params.term,
            // limit: 5
          };

          return query;
        },
        processResults: (data) => {
          const results = _.map(data.data, (d) => {
            d.id = d._id;
            return d;
          });

          return {
            results,
          };
        },
        cache: true,
      },
      escapeMarkup: (markup) => markup,
      templateResult: (data) => {
        if (data.loading) {
          return data.text;
        }
        const markup = `<div class="row" style="max-width:98%">
            <div class="col text-left">${data.name},&nbsp;&nbsp;${data.eth_address}</div>
          </div>`;

        return markup;
      },
      templateSelection: (data) => {
        this.fire('aid-selected', data);

        return data.name || data.text || data.eth_address;
      },
    });
  }
}

export default ListPanel;
