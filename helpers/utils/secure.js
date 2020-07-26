const UserController = require("../../modules/user/user.controller");
const { ERR } = require("../error");

//This processes token from header x-access-token
const SecureAPI = (...perms) => {
  return function(req, res, next) {
    //TODO need to verify permissions
    var token = req.body.access_token || req.query.access_token || req.headers["access_token"];
    if (!token) throw ERR.TOKON_REQ;

    UserController.validateToken(token)
      .then(t => {
        req.tokenData = t.data;
        let user_perms = t.data.permissions || [];
        if (perms.length > 0) {
          if (!checkPermissions(user_perms, perms)) throw ERR.UNAUTHORIZED;
        }
        next();
      })
      .catch(next);
  };
};

//This processes token from cookies
const SecureUI = (...perms) => {
  return (req, res, next) => {
    if (req.originalUrl) res.cookie("redirect_url", req.originalUrl);

    var token =
      req.cookies.access_token ||
      req.query.access_token ||
      req.body.access_token ||
      req.headers["access_token"];
    if (!token) {
      res.redirect("/login");
      return;
    }

    UserController.validateToken(token)
      .then(t => {
        req.tokenData = t.data;
        let user_perms = t.data.permissions || [];
        if (perms.length > 0) {
          if (!checkPermissions(user_perms, perms)) {
            res.redirect("/unauthorized");
            return;
          }
        }
        res.clearCookie("redirect_url");
        next();
      })
      .catch(err => {
        res.redirect("/login");
        return;
      });
  };
};

const checkPermissions = (user_perm, access_perm) => {
  return user_perm.some(v => access_perm.indexOf(v) !== -1);
};

module.exports = {
  SecureAPI,
  SecureUI
};
