const router = require('express').Router();
const AidController = require('./aid.controller');
const { SecureAPI } = require('../../helpers/utils/secure');
const { PM, ERR } = require('../../helpers');
const AgencyController = require('../agency/agency.controller');

router.get('/', SecureAPI(PM.AGENCY), (req, res, next) => {
  const limit = req.query.limit || 20;
  const start = req.query.start || 0;
  const userId = req.tokenData.user_id;
  AidController.list(userId, {
    start,
    limit,
  })
    .then((d) => {
      res.json(d);
    })
    .catch((err) => next(err));
});

router.get('/projects', (req, res, next) => {
  const limit = req.query.limit || 20;
  const start = req.query.start || 0;

  AidController.listAll({
    start,
    limit,
  })
    .then((d) => {
      res.json(d);
    })
    .catch((err) => next(err));
});

router.post('/', SecureAPI(PM.AGENCY), async (req, res, next) => {
  const userId = req.tokenData.user_id;
  const payload = req.body;
  if (!payload.fund) {
    payload.fund = 0;
  }
  if (!payload.eth_address) {
    payload.eth_address = '0x0';
  }
  payload.hosted_by = userId;
  try {
    const aid = await AidController.add(payload);
    AgencyController.addAid(userId, aid._id, payload.fund).then((d) => {
      res.json({ status: true, data: d }).catch((e) => {
        res.json({ status: false, error: e });
      });
    });
  } catch (e) {
    res.json({ status: false, Error: e });
  }
});

router.get('/:id', (req, res, next) => {
  const agencyId = req.params.id;
  AidController.getById(agencyId)
    .then((d) => {
      res.json(d);
    })
    .catch((err) => next(err));
});

router.post('/:id', SecureAPI(PM.AGENCY), async (req, res) => {
  AidController.update(req.params.id, req.body)
    .then((d) => {
      res.json(d);
    })
    .catch((err) => next(err));
});

router.post('/:id/beneficiary', SecureAPI(PM.AGENCY), async (req, res, next) => {
  AidController.enrollBeneficiary(req.params.id, req.body)
    .then((d) => {
      res.json(d);
    })
    .catch((err) => res.json(err));
});
router.post('/:id/vendor', SecureAPI(PM.AGENCY), async (req, res, next) => {
  AidController.enrollVendor(req.params.id, req.body)
    .then((d) => {
      res.json(d);
    })
    .catch((err) => res.json(err));
});

router.post('/:id/claimable', SecureAPI(PM.AGENCY), async (req, res, next) => {
  const { beneficiaryId } = req.body;
  const { claimable } = req.body;

  AidController.updateClaimables(req.params.id, beneficiaryId, claimable)
    .then((d) => {
      res.json(d);
    })
    .catch((err) => res.json(err));
});

router.get('/:id/beneficiary', SecureAPI(PM.AGENCY), async (req, res, next) => {
  AidController.listBeneficiaries(req.params.id)
    .then((d) => {
      res.json({ data: d });
    })
    .catch((err) => {
      console.log('err');
      res.json(err);
    });
});
router.get('/:id/vendor', SecureAPI(PM.AGENCY), async (req, res, next) => {
  AidController.listVendors(req.params.id)
    .then((d) => {
      res.json({ data: d });
    })
    .catch((err) => res.json(err));
});

module.exports = router;
