const router = require('express').Router();
const AgencyController = require('./agency.controller');
const { SecureAPI } = require('../../helpers/utils/secure');
const { PM, ERR } = require('../../helpers');
const UserController = require('../user/user.controller');
const AidController = require('../aid/aid.controller');

router.post('/', SecureAPI(), (req, res, next) => {
  const payload = req.body;
  payload.roles = 'agency';
  const agency = { name: payload.name, eth_address: payload.eth_address, approve: true };

  UserController.createUsingEmail(payload)
    .then((u) => {
      agency.owned_by = u._id;
      AgencyController.add(agency)
        .then((d) => res.json({ user: u, agency: d }))
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
});
router.post('/register', (req, res, next) => {
  const payload = req.body;
  payload.roles = 'member';
  const agency = { name: payload.name, eth_address: payload.eth_address, token: payload.token };

  UserController.createUsingEmail(payload)
    .then((u) => {
      agency.owned_by = u._id;
      AgencyController.add(agency)
        .then((d) => res.json({ user: u, agency }))
        .catch((e) => next(e));
    })
    .catch((e) => next(e));
});

router.post('/:id/approve', SecureAPI(), async (req, res, next) => {
  const agencyId = req.params.id;

  try {
    const agency = await AgencyController.approveAgency(agencyId);
    const user = await UserController.addRoles({ user_id: agency.owned_by, roles: 'agency' });
    res.json({ status: true, data: { user, agency } });
  } catch (e) {
    res.json({ status: false, data: e });
  }
});

router.get('/', SecureAPI(), (req, res, next) => {
  const limit = req.query.limit || 20;
  const start = req.query.start || 0;
  AgencyController.list({
    start,
    limit,
  })
    .then((d) => {
      res.json(d);
    })
    .catch((err) => next(err));
});

router.get('/:id', (req, res, next) => {
  const agencyId = req.params.id;
  AgencyController.getById(agencyId)
    .then((d) => {
      res.json(d);
    })
    .catch((err) => next(err));
});

router.post('/:id/token', SecureAPI(), async (req, res, next) => {
  // let agencyId = req.params.id;
  const payload = req.body;
  const agencyId = req.params.id;
  try {
    const token = await AgencyController.addToken(agencyId, payload);
    res.json({ status: true, data: token });
  } catch (e) {
    res.json({ status: false, data: e });
  }
});

router.post('/aid', SecureAPI(), async (req, res, next) => {
  const userId = req.tokenData.user_id;
  const payload = req.body;
  if (!payload.fund) {
    payload.fund = 0;
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

  // AidController.add(payload).then(d => {
  //   console.log("aid..............", d);
  //   AgencyController.addAid(agencyId, d._id, payload.fund).then(aid => {
  //     res.json({ status: true, data: aid }).catch(e => {
  //       res.json({ status: true, data: e });
  //     });
  //   });
  // });
});

module.exports = router;
