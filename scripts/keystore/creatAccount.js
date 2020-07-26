const Web3 = require("web3");
const fs = require("fs");

let web3 = new Web3();

let newAccount = JSON.stringify(web3.eth.accounts.create());

fs.writeFileSync(process.argv[2] + ".txt", newAccount, function (err, data) {
  if (err) {
    return console.log(err);
  }
  console.log(data);
});

console.log(newAccount);
