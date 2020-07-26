import { Form, Panel } from 'rumsan-ui';
import Service from './service';
import UserService from '../user/service';

class AgencyEdit extends Panel {
  constructor(cfg) {
    super(cfg);
    this.registerEvents('save', 'data-load', 'token-deployed', 'token-added');

    this.form = new Form({
      target: `${cfg.target} form`,
      onSubmit: () => {
        this.save();
      },
    });
  }

  async deployToken(account, instance) {
    try {
      const {
        tokenName, symbol, supply, eth_address,
      } = this.form.get();

      const receipt = await instance.methods
        .generateToken(supply, tokenName, symbol, eth_address)
        .send({ from: account });

      if (receipt.status) {
        await Service.approve(agencyId);
        this.addToken(instance);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async addToken(instance) {
    const { tokenName, symbol, supply } = this.form.get();
    const eth_address = await this.tokenAddress(instance);
    const data = {
      name: tokenName, symbol, supply, eth_address, onChain: true,
    };

    const resData = await Service.addToken(data);
    if (!resData) return;
    this.fire('token-added', resData);
  }

  async tokenAddress(instance) {
    const { eth_address } = this.form.get();
    try {
      const tokenAddress = await instance.methods.tokens(eth_address).call();

      return tokenAddress;
    } catch (e) {
      console.log(error);
    }
  }

  async loadData(agencyId) {
    this.showLoading();
    this.agencyData = await Service.get(agencyId);

    const { token } = this.agencyData;
    this.userData = await UserService.get(this.agencyData.owned_by);

    if (token) {
      this.form.set(
        {
          ...this.userData, ...this.agencyData, ...token, tokenName: token.name,
        },
      );
    } else {
      this.form.set({ ...this.userData, ...this.agencyData });
    }
    this.fire('data-load', this.data);
    this.hideLoading();
    return token;
  }

  async save() {
    if (!this.form.validate()) return;
    const data = this.form.get();
    await Service.save(this.data._id, data);
    this.fire('save', data);
  }
}

export default AgencyEdit;
