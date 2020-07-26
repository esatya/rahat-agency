import { Form, Panel } from 'rumsan-ui';
import Service from './service';

class RegisterPanel extends Panel {
  constructor(cfg) {
    super(cfg);
    this.registerEvents('agency-registered');

    this.form = new Form({
      target: `${cfg.target} form`,
    });
  }

  async addAgency() {
    if (!this.comp.validate()) return;
    try {
      const data = await this.form.get();
      const { tokenName, symbol, supply } = data;
      data.token = { name: tokenName, symbol, supply };
      const resData = await Service.register(data);
      if (!resData) return;
      this.fire('agency-registered', resData);
      this.form.clear();
    } catch (e) {
      console.error(e);
    }
  }
}

export default RegisterPanel;
