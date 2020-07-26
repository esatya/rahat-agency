import VendorTable from "./list.panel";
import VendorAdd from "./add.modal";

import config from "../config";

import getWeb3 from "../helper/getWeb3";
import cashAidFactoryArtifact from "../../../build/contracts/CashAidFactory";
import { initContract } from "../helper/contract";

$(document).ready(async function () {
  console.log(config.debugMode);
  const web3 = await getWeb3();
  let account = await web3.eth.getCoinbase();
  console.log(account);
  let cashAidFactoryInstance = await initContract(web3, cashAidFactoryArtifact);
  let tokenAddress = await cashAidFactoryInstance.methods.tokens(account).call();
  console.log("token Address:::::", tokenAddress);
  $("#currentAccount").html(`<h4><strong>Current Account:</strong> <em>${account}</em></h4>  `);
  window.ethereum.on("accountsChanged", async function () {
    account = await web3.eth.getCoinbase();
    console.log(account);
    $("#currentAccount").html(`<h4><strong>Current Account:</strong> <em>${account}</em></h4>  `);
  });

  let vt = new VendorTable({ target: "#vendor-table" });
  let vendorAdd = new VendorAdd({
    target: "#mdlVendorAdd",
    instance: cashAidFactoryInstance,
    account: account,
    web3: web3
  });

  $("#btnVendorAdd").on("click", () => {
    vendorAdd.open();
  });

  // $("#aid-table tbody").on("click", "#btnDeploy", d => {
  //   console.log("deploying");
  //   console.log(cashAidFactoryInstance);
  // });

  vendorAdd.on("vendor-added", () => {
    vt.reload();
  });

  vt.on("aid-selected", (e, d) => {
    vt.load(`${config.apiPath}/aid/${d._id}/vendor`);
  });
});
