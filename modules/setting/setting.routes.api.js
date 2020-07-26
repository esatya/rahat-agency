const router = require("express").Router();

const { SecureAPI } = require("../../helpers/utils/secure");
const SettingController = require("./setting.controller");

router.post("/", SecureAPI(), (q, r, n) => {
  let { name, value, is_public } = q.body;
  SettingController.add(name, value, is_public)
    .then(d => r.json(d))
    .catch(err => n(err));
});
router.get("/", SecureAPI(), (q, r, n) => {
  SettingController.getAll()
    .then(d => r.json(d))
    .catch(e => n(e));
});

module.exports = router;
