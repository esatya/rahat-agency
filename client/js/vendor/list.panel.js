import config from "../config";
import { TablePanel, Session, Notify } from "rumsan-ui";
import Services from "./service";

class ListPanel extends TablePanel {
  constructor(cfg) {
    cfg.url = `${config.apiPath}/vendor`;
    super(cfg);

    this.registerEvents("aid-selected");
    this.renderAidSelector();

    this.render();
  }

  setColumns() {
    return [
      { data: "name" },
      { data: "eth_address" },
      { data: "phone" },
      { data: "email" },
      { data: "address" }
    ];
  }

  renderAidSelector() {
    $(`#vd_aid_select`).select2({
      width: "100%",
      placeholder: "Search/Select",
      ajax: {
        url: `${config.apiPath}/aid`,
        headers: Session.getToken(),
        dataType: "json",
        data: function (params) {
          console.log("PARAMS", params);
          var query = {
            name: params.term
            // limit: 5
          };
          return query;
        },
        processResults: data => {
          let results = _.map(data.data, d => {
            d.id = d._id;
            console.log("results..", d);
            return d;
          });
          return {
            results
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
        this.fire("aid-selected", data);
        return data.name || data.text;
      }
    });
  }
}

export default ListPanel;
