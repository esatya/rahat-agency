const router = require('express').Router();
const mongoose = require('mongoose');
const xlsxtojson = require('xlsx-to-json-lc');
const xlstojson = require('xls-to-json-lc');
const fs = require('fs');
const beneficiaryController = require('./beneficiary.controller');
const agencyController = require('../agency/agency.controller');
const aidController = require('../aid/aid.controller');
const { SecureAPI } = require('../../helpers/utils/secure');
const { PM, ERR } = require('../../helpers');

const { ObjectId } = mongoose.Types;

const upload = require('../../helpers/utils/fileUpload');

router.post('/', SecureAPI(PM.AGENCY), async (req, res, next) => {
  const userId = req.tokenData.user_id;
  const agencyId = await agencyController.getCurrentId(userId);
  const payload = Object.assign(req.body, { agency: agencyId });
  // TODO: check object ID validity

  beneficiaryController
    .add(payload)
    .then(async (d) => {
      if (payload.aidId) {
        await aidController.enrollBeneficiary(payload.aidId, { beneficiary: d._id });
      }
      res.json(d);
    })
    .catch((e) => next(e));
});

router.get('/', SecureAPI(PM.AGENCY), async (req, res, next) => {
  const userId = req.tokenData.user_id;
  const agencyId = await agencyController.getCurrentId(userId);
  const limit = req.query.limit || 20;
  const start = req.query.start || 0;
  beneficiaryController
    .list(agencyId, {
      start,
      limit,
    })
    .then((d) => {
      res.json(d);
    })
    .catch((err) => next(err));
});

router.post('/upload', (req, res, next) => {
  let exceltojson;
  upload(req, res, (err) => {
    if (err) {
      console.log('error......');
      res.json({ error_code: 1, err_desc: err });
      return;
    }

    if (!req.file) {
      res.json({ error_code: 1, err_desc: 'No file passed' });
      return;
    }

    if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
      exceltojson = xlsxtojson;
    } else {
      exceltojson = xlstojson;
    }
    try {
      exceltojson(
        {
          input: req.file.path,
          output: null, // No output.json
          lowerCaseHeaders: true,
        },
        (err, result) => {
          if (err) {
            fs.unlinkSync(req.file.path);
            return res.json({ error_code: 1, err_desc: err, data: null });
          }
          fs.unlinkSync(req.file.path);
          res.json({ error_code: 0, err_desc: null, data: result });
        },
      );
    } catch (e) {
      res.json({ error_code: 1, err_desc: 'Corupted excel file' });
    }
  });
});

module.exports = router;
