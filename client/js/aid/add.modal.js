import { Modal, Form } from 'rumsan-ui';
import Service from './service';

class AddAid extends Modal {
  constructor(cfg) {
    super(cfg);
    this.form = new Form({ target: `${cfg.target} form` });
    this.registerEvents('aid-added', 'contract-deployed');

    this.comp.submit(async (e) => {
      e.preventDefault();
      this.addAidProject();
    });
  }

  async addAidProject() {
    if (!this.comp.validate()) return;

    const data = await this.form.get();

    const resData = await Service.add(data);
    if (!resData) return;

    this.fire('aid-added', resData);
    this.form.clear();
    this.close();
  }

  async setContractAddress(aidId, data) {
    const resData = await Service.update(aidId, data);
    if (!resData) return;
    this.fire('contract-deployed', resData);
  }
}

export default AddAid;
