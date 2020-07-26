import config from "../config";
import Service from "./service";
import { Panel, TablePanel, Notify, Session } from "rumsan-ui";

class RolePanel extends Panel {
  constructor(cfg) {
    super(cfg);
    this.registerEvents("data-change", "remove-role");

    this.list = new TablePanel({
      target: cfg.tblTarget,
      tblConfig: {
        columns: this.setColumns()
      }
    });
    this.list.render();
    this.listAvailableRoles();

    this.on("remove-role", async (e, d) => {
      await this.removeRole(d.role);
    });
  }

  setColumns() {
    return [
      {
        data: "role",
        title: "Roles"
      },
      {
        title: "Action",
        data: null,
        class: "text-center",
        render: d => {
          return `<button class= "btn btn-danger btn-xs" onclick="$('${this.target}').trigger('remove-role', {source: this, role:'${d.role}'})"><i class="fa fa-trash"></i></button>`;
        }
      }
    ];
  }

  setUserData(uData) {
    this.showLoading();
    this.userData = uData;
    if (uData.roles)
      this.list.loadData(
        uData.roles.map(d => {
          return { role: d };
        })
      );
    this.list.show();
    this.hideLoading(true);
  }

  listAvailableRoles() {
    this.roleSelector = $(`${this.target} .select2`).select2({
      width: "100%",
      placeholder: "Search a role to add...",
      minimumInputLength: 1,
      ajax: {
        url: `${config.apiPath}/roles`,
        headers: Session.getToken(),
        dataType: "json",
        data: function(params) {
          var query = {
            search: {
              value: params.term
            },
            limit: 10
          };
          return query;
        },
        processResults: data => {
          return {
            results: data.data
              .map(d => {
                d.id = d._id;
                return d;
              })
              .filter(d => !this.userData.roles.includes(d.name))
          };
        },
        cache: true
      },
      escapeMarkup: markup => {
        return markup;
      },
      templateResult: data => {
        if (data.loading) {
          return data.text;
        }

        var markup = `<div class="row" style="max-width:98%">
          <div class="col text-left">${data.name}</div>
        </div>`;

        return markup;
      },
      templateSelection: data => {
        return "Search a role to add...";
      }
    });

    this.roleSelector.on("select2:select", async e => {
      await this.addRole(e.params.data.name);
    });
  }

  async addRole(name) {
    await Service.addRole(this.userData._id, name);
    Notify.show(`Role "${name}" has been added to the user.`);
    this.fire("data-change");
  }

  async removeRole(name) {
    let isConfirm = await swal.fire({
      title: "Are you sure?",
      text: "You are remove a role from the user.",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    });

    if (isConfirm.value) {
      await Service.removeRole(this.userData._id, name);
      Notify.show(`Role "${name}" has been removed from the user.`);
      this.fire("data-change");
    }
  }
}

export default RolePanel;
