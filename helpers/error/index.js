const errors = require("./errors.js");
class RSError extends Error {
  constructor(message, name, httpCode) {
    super(message);
    this.message = message;
    this.data = {
      type: "rserror",
      message,
      name: name || "default",
      httpCode: httpCode || 500
    };
    this.status = httpCode || 500;
    this.className = this.constructor.name;
    this.stack = new Error(message).stack;
  }
}

const ERR = errors(RSError);

// const CreateErrorsFromJsonFile = () => {
//   const coll = {};
//   Object.keys(errors).forEach(key => {
//     let data = errors[key];
//     if (typeof data == "string") data = { msg: data, code: 400 };
//     data.code = data.code || 400;
//     data.msg = data.msg || "Error message is not described.";
//     coll[key] = new RSError(data.msg, key.toLocaleLowerCase(), data.code);
//   });
//   return coll;
// };

const throwError = err => {
  throw err;
};
module.exports = { Error: RSError, ERR, throwError };
