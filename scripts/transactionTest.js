const tx = require('./account.helper');

let account;

(async function () {
  account = await tx.createAccount('ahskfjash', '1234');
  console.log(account);
}());

console.log(account);
