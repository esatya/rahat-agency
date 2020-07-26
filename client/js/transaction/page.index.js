import TransactionTable from "./list.panel";
import cashAidFactoryArtifact from "../../../build/contracts/CashAidFactory";
import getWeb3 from "../helper/getWeb3";
import config from "../config";

$(document).ready(async function () {
  const web3 = await getWeb3();
  let account = await web3.eth.getCoinbase();

  let txTable = new TransactionTable({ target: "#transaction-table" });
  let cashAidFactoryaddress = cashAidFactoryArtifact.networks[config.networkId].address;

  txTable.on("transact", async (e, d) => {
    console.log("encoded", d);
    let txObj = {
      from: account,
      to: cashAidFactoryaddress,
      data: d.encoded
    };

    let add = await web3.eth.sendTransaction(txObj);
    console.log(add);
  });
});
