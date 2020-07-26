const router = require('express').Router();
const vendorController = require('./vendor.controller');
const agencyController = require('../agency/agency.controller');
const aidController = require('../aid/aid.controller');
const { SecureAPI } = require('../../helpers/utils/secure');
const { PM, ERR } = require('../../helpers');

router.post('/', SecureAPI(PM.AGENCY), async (req, res, next) => {
  const userId = req.tokenData.user_id;
  const agencyId = await agencyController.getCurrentId(userId);

  const payload = Object.assign(req.body, { agency: agencyId });

  vendorController
    .add(payload)
    .then(async (d) => {
      if (payload.aidId) {
        await aidController.enrollVendor(payload.aidId, { vendor: d._id });
      }

      res.json(d);
    })
    .catch((e) => next(e));
});

router.get('/', SecureAPI(PM.AGENCY), async (req, res, next) => {
  console.log('list');
  userId = req.tokenData.user_id;
  const agencyId = await agencyController.getCurrentId(userId);
  const limit = req.query.limit || 20;
  const start = req.query.start || 0;
  vendorController
    .list(agencyId, {
      start,
      limit,
    })
    .then((d) => {
      res.json(d);
    })
    .catch((err) => next(err));
});

module.exports = router;
