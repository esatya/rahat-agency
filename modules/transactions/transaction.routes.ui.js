const router = require("express").Router();
const { SecureUI } = require("../../helpers/utils/secure");
const { PM, ERR } = require("../../helpers");
router.get("/", (req, res, next) => {
  res.render("transaction/index", {
    title: "transaction List"
  });
});

module.exports = router;
