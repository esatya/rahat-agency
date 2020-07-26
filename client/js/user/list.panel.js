import config from "../config";
import { TablePanel, Notify } from "rumsan-ui";
import Services from "./service";

class ListPanel extends TablePanel {
  constructor(cfg) {
    cfg.url = `${config.apiPath}/users`;
    super(cfg);
    this.registerEvents("change-user-status");

    this.on("change-user-status", async (event, data) => {
      let checked = await this.changeUserStatus(data.userId, data.source.checked, data.full_name);
      data.source.checked = checked;
    });
    this.render();
  }

  setColumns() {
    return [
      { data: "full_name" },
      {
        data: null,
        render: d => {
          let phone = d.comms.find(e => {
            return e.type == "phone";
          });
          return phone ? phone.address : "";
        }
      },
      {
        data: null,
        render: d => {
          let email = d.comms.find(e => {
            return e.type == "email";
          });
          return email ? email.address : "";
        }
      },
      {
        data: null,
        render: d => {
          return d.gender || "";
        }
      },
      {
        data: null,
        render: d => {
          return d.dob || "";
        }
      },
      {
        data: null,
        render: d => {
          if (d.is_active)
            return `<input type="checkbox" checked onclick="$('${this.target}').trigger('change-user-status', {source: this, userId:'${d._id}', full_name:'${d.full_name}'})" />`;
          else
            return `<input type="checkbox" onclick="$('${this.target}').trigger('change-user-status', {source: this, userId:'${d._id}', full_name:'${d.full_name}'})" />`;
        }
      },
      {
        data: null,
        class: "text-center",
        render: function(data, type, full, meta) {
          return `&nbsp;&nbsp;
        <a href='/users/${data._id}' title='Edit Employee'><i class='fa fa-pencil'></i></a>&nbsp;&nbsp;`;
        }
      }
    ];
  }

  async changeUserStatus(user_id, isActive, full_name) {
    let isConfirm = await swal.fire({
      title: "Are you sure?",
      text: "You are changing status of the user.",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    });

    try {
      if (isConfirm.value) {
        await Services.changeStatus(user_id, isActive);
        if (isActive) Notify.show(`User "${full_name}" has been activated.`);
        else Notify.warning(`User "${full_name}" has been deactivated.`);
        return isActive;
      } else {
        return !isActive;
      }
    } catch (e) {
      console.log(e.message);
      return !isActive;
    }
  }
}

export default ListPanel;
