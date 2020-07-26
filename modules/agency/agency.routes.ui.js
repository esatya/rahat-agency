const router = require('express').Router();
const { SecureUI } = require('../../helpers/utils/secure');
const { PM, ERR } = require('../../helpers');

router.get('/', SecureUI(), (req, res, next) => {
  res.render('agency/index', {
    title: 'Agency List',
  });
});

router.get('/registration', (req, res, next) => {
  res.render('agency/registerWizard', {
    title: 'Agency Registration',
  });
});

router.get('/:agency_id', SecureUI(), (req, res, next) => {
  res.render('agency/details', {
    title: 'Agency Details',
    data: {
      agency_id: req.params.agency_id,
    },
  });
});

module.exports = router;
