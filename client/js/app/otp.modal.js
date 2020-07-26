import { Modal, Form } from 'rumsan-ui';

class OTP extends Modal {
  constructor(cfg) {
    super(cfg);

    this.registerEvents('token-retrieved');
    this.form = new Form({ target: `${cfg.target} form` });

    this.comp.submit(async (e) => {
      e.preventDefault();

      try {
        const { otp } = this.form.get();
        this.getToken(cfg.account, cfg.cashAidInstance, this.phone, otp);
      } catch (e) {
        console.error(e);
      }
    });
  }

  async getToken(account, instance, phone, otp) {
    const receipt = await instance.methods.getTokens(phone, otp).send({ from: account });
    if (receipt.status) {
      this.fire('token-retrieved', { phone, amount: this.amount });
    }
  }
}

export default OTP;
