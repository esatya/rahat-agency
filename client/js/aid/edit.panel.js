import { Form, Panel } from 'rumsan-ui';
import Service from './service';
import UserService from '../user/service';

import cashAidArtifact from '../../../build/contracts/CashAidFactory';

class AgencyEdit extends Panel {
  constructor(cfg) {
    super(cfg);
    this.registerEvents('save', 'data-load', 'token-added');

    this.form = new Form({
      target: `${cfg.target} form`,
      onSubmit: () => {
        this.save();
      },
    });
  }

  async loadData(aidId) {
    this.showLoading();
    this.aidData = await Service.get(aidId);

    this.form.set(
      {
        ...this.aiddata,
        name: this.aidData.name,
        eth_address: this.aidData.eth_address,
      },
    );

    this.fire('data-load', this.data);
    this.hideLoading();
  }

  async getAddress() {
    const { eth_address } = this.form.get();

    return eth_address;
  }

  async getbalance(tokenInstance, account) {
    return await tokenInstance.methods.balanceOf(account).call();
  }

  async save() {
    if (!this.form.validate()) return;
    const data = this.form.get();
    await Service.save(this.data._id, data);
    this.fire('save', data);
  }
}

export default AgencyEdit;
