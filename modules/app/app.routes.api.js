const router = require('express').Router();
const vendorController = require('../vendor/vendor.controller');

router.post('/verify', (req, res) => {
  const addr = req.body.address.slice(0, 2) + req.body.address.slice(2).toUpperCase();
  vendorController
    .check(addr)
    .then((d) => {
      res.json(d);
    })
    .catch((e) => {
      res.json(e);
    });
});

module.exports = router;
