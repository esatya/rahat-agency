const router = require("express").Router();
const { SecureUI } = require("../../helpers/utils/secure");

router.get("/", SecureUI(), (req, res, next) => {
  res.render("user/index", {
    title: "User List"
  });
});

router.get("/:user_id", SecureUI(), (req, res, next) => {
  res.render("user/details", {
    title: "User Details",
    data: {
      user_id: req.params.user_id
    }
  });
});

module.exports = router;
