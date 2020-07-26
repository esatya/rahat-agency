import Service from "./service";
import PermissionSelect from "./permission.select";
import { Panel, TablePanel, Notify, Alert } from "rumsan-ui";

class RolePermissions extends Panel {
  constructor(cfg) {
    super(cfg);

    this.registerEvents("remove-permission", "permission-changed");

    this.list = new TablePanel({
      target: `${cfg.listTarget}`,
      tblConfig: {
        columns: this.setColumns()
      }
    });
    this.list.render();

    this.permissionSelector = new PermissionSelect({
      target: `${this.target}`
    });

    this.on("remove-permission", (e, d) => {
      this.removePermission(d.permission);
    });
  }

  async addPermission() {
    let permissions = this.permissionSelector.getValues();
    let role = await Service.addPermissions(this.data._id, permissions);
    this.permissionSelector.clear();
    this.loadNewPermissions(role.permissions);
    this.fire("permission-changed", { role });
    Notify.show("New permissions have beed added to the role.");
  }

  loadNewPermissions(permissions) {
    this.list.loadData(permissions);
    this.permissionSelector.reloadData(permissions);
  }

  async loadData(data) {
    this.show();
    this.data = data;
    data = this.data = await Service.get(data._id);
    $(`${this.target} .title-role-name`).html(this.data.name);
    this.loadNewPermissions(this.data.permissions);
  }

  async removePermission(permission) {
    let isConfirmed = await Alert.confirm(
      `You are removing permission "${permission}" from "${this.data.name}"`
    );
    if (!isConfirmed) return;

    let permCount = this.list.table.data().count();
    if (permCount < 2) {
      isConfirmed = await Alert.confirm({
        text: `You are removing the last permission from "${this.data.name}" role. This role will have no permission after this.`,
        confirmButtonText: "Yes, I Understand",
        cancelButtonText: "Cancel"
      });
      if (!isConfirmed) return;
    }

    let role = await Service.removePermissions(this.data._id, permission);
    this.loadNewPermissions(role.permissions);
    // let rowIndex = this.list.getRowByValue(permission);
    // this.list.table
    //   .row(rowIndex)
    //   .remove()
    //   .draw(false);
    this.fire("permission-changed", { role });
    Notify.show(`Permission "${permission}" has been removed from role "${this.data.name}".`);
  }

  setColumns() {
    return [
      {
        name: "permission"
      },
      {
        data: null,
        class: "text-center",
        render: (d, type, full, meta) => {
          if (this.data.is_system) return "";
          return `<button class= "btn btn-danger btn-xs" onclick="$('${this.target}').trigger('remove-permission', {source: this, rowIndex:${meta.row}, permission:'${d[0]}'})"><i class="fa fa-trash"></i></button>`;
        }
      }
    ];
  }
}

export default RolePermissions;
