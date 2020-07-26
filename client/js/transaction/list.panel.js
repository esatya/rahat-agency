import config from "../config";
import { TablePanel, Notify } from "rumsan-ui";

class ListPanel extends TablePanel {
  constructor(cfg) {
    console.log("ajfs", cfg);
    cfg.url = `${config.apiPath}/transactions`;
    super(cfg);

    this.registerEvents("transact");

    this.render();
  }

  setColumns() {
    return [
      { data: "name" },
      { data: "originModel" },
      {
        data: null,
        render: d => {
          if (d.sender) return d.sender;
          else return "<span style='color: #ff0000;'>NOT SENT</span>";
        }
      },
      {
        data: null,
        render: d => {
          return new Date(d.createdAt).toUTCString().slice(0, -3);
        }
      },
      {
        data: null,

        render: d => {
          return `<button onclick="$('${this.target}').trigger('transact',{encoded:'${d.encodedTx}',contract:'${d.contract}'})" 
          type="button" class="btn btn-primary btn-xs">Sign Transaciton</button>`;
        }
      }
    ];
  }
}

export default ListPanel;
