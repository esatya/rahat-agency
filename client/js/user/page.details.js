import UserEdit from "./edit.panel";
import RolePanel from "./role.panel";

$(document).ready(function() {
  let ut = new UserEdit({ target: "#UserDetailsPanel" });
  let rolePanel = new RolePanel({ target: "#UserRolePanel", tblTarget: "#UserRoleTable" });
  ut.on("data-load", (e, d) => rolePanel.setUserData(d));
  ut.loadData(userId);

  rolePanel.on("data-change", () => ut.loadData(userId));
});
