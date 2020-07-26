const router = require('express').Router();
const { SecureUI } = require('../../helpers/utils/secure');
const { PM, ERR } = require('../../helpers');

router.get('/', SecureUI(PM.AGENCY), (req, res, next) => {
  res.render('beneficiary/index', {
    title: 'beneficiary List',
  });
});

module.exports = router;
