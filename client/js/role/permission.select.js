import { Component } from "rumsan-ui";
import Service from "./service";

class PermissionSelect extends Component {
  constructor(cfg) {
    super(cfg);
    this.parentTarget = $(`${cfg.target} .modal-header`);
    this.target = `${cfg.target} [name=permissions]`;
    this.renderInModal = cfg.renderInModal;
    this.render();
  }

  async render() {
    this.data = await Service.listPermissions();
    this.data = this.data.map((d, i) => {
      return {
        id: d,
        text: d
      };
    });

    let config = {
      width: "100%",
      placeholder: "Search permissions for the role",
      data: this.data,
      escapeMarkup: markup => {
        return markup;
      },
      templateResult: data => {
        if (data.loading) {
          return data.text;
        }
        var markup = `<div class="row" style="max-width:98%">
          <div class="col text-left">${data.text}</div>
          </div>`;
        return markup;
      },
      templateSelection: data => {
        return data.text;
      }
    };
    if (this.renderInModal) config.dropdownParent = this.parentTarget;

    $(this.target).select2(config);
  }

  getValues() {
    return $(this.target).val();
  }

  reloadData(excludeItems) {
    $(this.target).empty();
    let data = this.data.filter(d => !excludeItems.includes(d.id));
    $(this.target).select2({ data });
  }

  clear() {
    $(this.target)
      .val(null)
      .trigger("change");
  }
}

export default PermissionSelect;
