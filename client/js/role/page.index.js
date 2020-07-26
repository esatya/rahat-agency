import RoleTable from "./list.panel";
import RolePermission from "./role.permissions";
import UserAdd from "./add.modal";

$(document).ready(function() {
  let roleList = new RoleTable({ target: "#rolesTable" });

  let rolePermissions = new RolePermission({
    target: "#rolePermissionPanel",
    listTarget: "#rolePermissionTable"
  });
  let roleAdd = new UserAdd({ target: "#addRole" });

  roleAdd.on("role-added", () => {
    roleList.reload();
  });

  roleList.table.on("select", (e, d) => {
    rolePermissions.loadData(d.data());
  });

  $("#btnRoleAdd").on("click", () => {
    roleAdd.open();
  });

  $("#btnAddPermissions").on("click", () => {
    rolePermissions.addPermission();
  });
});
