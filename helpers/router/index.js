const router = require("express").Router();
const config = require("config");

const { SecureUI } = require("../utils/secure");
const { api_v1, ui } = require("./routes.json");
const SettingController = require("../../modules/setting/setting.controller");

//enables Passport Logins
if (config.has("app.enableSocial")) {
  if (config.get("app.enableSocial")) {
    require("../utils/passport");
  }
}

// Get home page
router.get("/", SecureUI(), (req, res, next) => {
  res.render("index", { title: "Rumsan Seed" });
});

router.get("/settings", SecureUI(), (req, res, next) => {
  res.render("misc/settings", { title: "Settings" });
});

router.use("/", require("../../modules/user/auth.routes"));

Object.keys(api_v1).forEach(key => {
  router.use(`/api/v1/${key}`, require(api_v1[key]));
});

Object.keys(ui).forEach(key => {
  router.use(`/${key}`, require(ui[key]));
});

module.exports = router;
