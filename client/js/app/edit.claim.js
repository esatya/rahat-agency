import { Form, Panel, Modal } from 'rumsan-ui';

class ClaimEdit extends Panel {
  constructor(cfg) {
    super(cfg);
    this.registerEvents('token-claimed', 'token-retrieved');

    this.tokenClaimForm = new Form({
      target: `${cfg.tokenClaimTarget} form`,
      onSubmit: async (e) => {
        try {
          e.preventDefault();

          const { phone, token } = this.tokenClaimForm.get();
          await this.claimToken(cfg.account, cfg.factoryInstance, Number(phone), Number(token));
        } catch (e) {
          console.error(e);
          console.log(e);
        }
      },
    });
  }

  async claimToken(account, instance, phone, token) {
    const receipt = await instance.methods
      .claimToken(cashAidAddress, phone, token)
      .send({ from: account });

    if (receipt.status) {
      this.fire('token-claimed');
    }
  }
}

export default ClaimEdit;
