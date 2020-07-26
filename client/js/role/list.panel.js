import config from "../config";
import Service from "./service";
import { TablePanel, Notify, Alert } from "rumsan-ui";

class RoleTable extends TablePanel {
  constructor(cfg) {
    cfg.url = `${config.apiPath}/roles`;
    cfg.tblConfig = {
      select: true
    };
    super(cfg);
    this.registerEvents("remove-role");

    this.on("remove-role", (e, data) => {
      this.removeRole(data);
    });
    this.render();
  }

  setColumns() {
    return [
      {
        data: "name"
      },
      {
        data: null,
        render: d => {
          if (d.expiry_date) {
            return moment(d.expiry_date).format("YYYY-MM-DD");
          } else {
            return "Never";
          }
        }
      },
      {
        data: "is_system"
      },
      {
        data: null,
        class: "text-center",
        render: (d, type, full, meta) => {
          if (d.is_system) return "";
          return `<button class= "btn btn-danger btn-xs" onclick="$('${this.target}').trigger('remove-role', {source: this, id:'${d._id}', name:'${d.name}'})"><i class="fa fa-trash"></i></button>`;
        }
      }
    ];
  }

  async removeRole({ id, name }) {
    let isConfirmed = await Alert.confirm(`You are deleting the role "${name}".`);
    if (!isConfirmed) return;

    Service.remove(id);
    this.reload();
    Notify.show(`Role "${name}" has been deleted.`);
  }
}

export default RoleTable;
