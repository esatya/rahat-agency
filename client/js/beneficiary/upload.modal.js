import {
  Modal,
  Form,
  Session,
  Notify,
} from 'rumsan-ui';
import axios from 'axios';
import config from '../config';
import {
  initContract,
} from '../helper/contract';
import cashAidArtifact from '../../../build/contracts/CashAid';
import Service from './service';

class Upload extends Modal {
  constructor(cfg) {
    super(cfg);
    this.form = new Form({
      target: `${cfg.target} form`,
    });
    this.web3 = cfg.web3;
    this.account = cfg.account;
    this.registerEvents('bulk-beneficiary-added', 'aid-selected');
    this.renderAidSelector();
    this.on('aid-selected', async (e, d) => {
      this.instance = await initContract(this.web3, cashAidArtifact, d.eth_address);
    });
    this.comp.submit(async (e) => {
      e.preventDefault();
      try {
        this.addBeneficiary();
      } catch (e) {
        console.error(e);
      }
    });
  }

  async addBeneficiary() {
    const fileToUpload = $('#uploadedFile')[0].files[0];
    const {
      aidIdUpload,
    } = await this.form.get();

    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('aidId', aidIdUpload);

    try {
      const { data: { data } } = await axios.post('/api/v1/beneficiary/upload', formData);

      const phone = data.map((el) => Number(el.phone));
      const token = data.map((el) => Number(el.token));

      const receipt = await this.instance.methods
        .issueBulk(phone, token)
        .send({ from: this.account });

      if (receipt.status) {
        const result = await data.map(async (el) => {
          el.aidId = aidIdUpload;
          const resData = await Service.add(el);

          if (!resData) return;
          return resData;
        });
        this.fire('bulk-beneficiary-added');
        this.form.clear();
        this.close();
      }
    } catch (e) {
      console.error(e);
    }
  }

  renderAidSelector() {
    try {
      $(`${this.target} [name=aidIdUpload]`).select2({
        dropdownParent: $(`${this.target} .modal-header`),
        width: '100%',
        placeholder: 'Search/Select',
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
            <div class="col text-left">${data.name}</div>
          </div>`;
          return markup;
        },
        templateSelection: (data) => {
          this.fire('aid-selected', data);
          return data.name || data.text;
        },
      });
    } catch (e) {
      console.log(error);
      return error;
    }
  }
}
export default Upload;
