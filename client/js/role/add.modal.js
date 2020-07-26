import PermissionSelect from "./permission.select";
import Service from "./service";
import { Form, Modal, Notify } from "rumsan-ui";

class UserAdd extends Modal {
  constructor(cfg) {
    super(cfg);
    this.form = new Form({ target: `${cfg.target} form` });
    this.registerEvents("role-added");

    this.on("open", e => {
      this.permissionSelector = new PermissionSelect({
        renderInModal: true,
        target: this.target
      });
      //this.permissionSelector.render();
    });

    this.on("close", e => {
      this.form.clear();
    });

    this.comp.submit(e => {
      e.preventDefault();
      this.addRole();
    });
  }

  async addRole() {
    if (!this.comp.validate()) return;
    let data = this.form.getValues();
    data.permissions = this.permissionSelector.getValues();

    let resData = await Service.add(data);
    if (!resData) return;

    this.fire("role-added", resData);
    Notify.show(`Role "${data.name}" has been added.`);
    this.form.clear();
    this.close();
  }
}

export default UserAdd;
