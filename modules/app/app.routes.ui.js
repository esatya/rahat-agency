const router = require('express').Router();
const { SecureUI } = require('../../helpers/utils/secure');

router.get('/', (req, res, next) => {
  res.render('app/index', {
    title: 'vendor App',
  });
});

router.get('/:eth_address', (req, res, next) => {
  res.render('app/claim', {
    title: 'Claims',
    data: {
      eth_address: req.params.eth_address,
    },
  });
});

module.exports = router;
