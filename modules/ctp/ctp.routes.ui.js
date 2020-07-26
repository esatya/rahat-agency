const router = require("express").Router();

router.get("/", (req, res, next) => {
  res.render("ctp/index", {
    title: "book List "
  });
});

module.exports = router;
