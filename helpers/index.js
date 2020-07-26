const { Error, ERR } = require("./error");
const { PM, Permissions } = require("./permissions");

module.exports = {
  Error,
  ERR,
  PM,
  Permissions,
  Utils: require("./utils")
};
