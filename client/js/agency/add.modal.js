import { Modal, Form } from 'rumsan-ui';

import Service from './service';

class AgencyAdd extends Modal {
  constructor(cfg) {
    super(cfg);
    this.form = new Form({ target: `${cfg.target} form` });
    this.instance = cfg.instance;
    this.account = cfg.account;
    this.registerEvents('agency-added', 'agency-approved', 'transaction');

    this.comp.submit(async (e) => {
      e.preventDefault();

      // ++++++++++creates encoded transaction++++++++++
      // 0x25BE03f52bc61eAAf571bC87aAaB7885F6Bd49b2
      // encoded: 0x2aaf0ed4000000000000000000000000c52e90db78deb581d6cb8b5aebda0802ba8f37b5

      // try {
      //   console.log("on submit", cfg.instance);
      //   let { eth_address } = this.form.get();
      //   console.log(eth_address);

      //   let { agency } = await this.addAgency();

      //   let encodedTx = await cfg.instance.methods.registerAgency(eth_address).encodeABI();
      //   console.log("encoded Transaction:", encodedTx);
      //   console.log("AGENCY", agency);

      //   this.addTransaction(encodedTx, agency);
      // } catch (e) {
      //   console.error(e);
      // }

      // ++++++++++++++sends transation via metamask++++++++++
      try {
        const { eth_address } = this.form.get();
        const receipt = await cfg.instance.methods
          .registerAgency(eth_address)
          .send({ from: cfg.account });

        if (receipt.status) {
          this.addAgency();
        }
      } catch (e) {
        console.error(e);
      }
    });
  }

  async approveAgency(agencyId, eth_address) {
    try {
      const receipt = await this.instance.methods
        .registerAgency(eth_address)
        .send({ from: this.account });

      if (receipt.status) {
        const res = await Service.approve(agencyId);
        this.fire('agency-approved', res);
      }
    } catch (e) {

    }
  }

  async addAgency() {
    if (!this.comp.validate()) return;

    const data = await this.form.get();

    const resData = await Service.add(data);

    if (!resData) return;

    this.fire('agency-added', resData);
    this.form.clear();
    this.close();
    return resData;
  }

  async addTransaction(encodedTx, agency) {
    const tx = {
      name: 'Add Agency',
      encodedTx,
      origin: agency._id,
      originModel: 'Agency',
    };
    const res = await Service.addTx(tx);
    console.log(res);
  }
}

export default AgencyAdd;
