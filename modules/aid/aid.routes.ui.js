const router = require('express').Router();
const { SecureUI } = require('../../helpers/utils/secure');
const { PM, ERR } = require('../../helpers');

router.get('/', SecureUI(PM.AGENCY), (req, res, next) => {
  res.render('aid/index', {
    title: 'Aid Project List',
  });
});

router.get('/:aid_id', SecureUI(PM.AGENCY), (req, res, next) => {
  res.render('aid/details', {
    title: 'Aid Details',
    data: {
      aid_id: req.params.aid_id,
    },
  });
});

module.exports = router;
