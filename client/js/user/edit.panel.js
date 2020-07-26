import Service from "./service";
import { Form, Panel } from "rumsan-ui";

class UserEdit extends Panel {
  constructor(cfg) {
    super(cfg);
    this.registerEvents("save", "data-load");

    this.form = new Form({
      target: `${cfg.target} form`,
      onSubmit: () => {
        this.save();
      }
    });
  }

  async loadData(userId) {
    this.showLoading();
    this.data = await Service.get(userId);
    this.form.set(
      Object.assign({}, this.data, {
        name: this.data.name.full,
        dob: this.data.dob ? moment(this.data.dob).format("YYYY-MM-DD") : ""
      })
    );
    this.fire("data-load", this.data);
    this.hideLoading();
  }

  async save() {
    if (!this.form.validate()) return;
    let data = this.form.get();
    await Service.save(this.data._id, data);
    this.fire("save", data);
  }
}

export default UserEdit;
