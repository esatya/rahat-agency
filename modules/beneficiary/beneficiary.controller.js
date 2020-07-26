const mongoose = require('mongoose');
const beneficiaryModel = require('./beneficiary.model');
const { DataUtils } = require('../../helpers/utils');

const { ObjectId } = mongoose.Types;

class beneficiaryController {
  add(payload) {
    return beneficiaryModel.create(payload);
  }

  list(agencyId, { start = 0, limit = 50 }) {
    return DataUtils.paging({
      start,
      limit,
      sort: { name: 1 },
      model: beneficiaryModel,
      query: [{ $match: { agency: ObjectId(agencyId) } }],
    });
  }

  async getById(id) {
    return await beneficiaryModel.findById(id);
  }

  remove(id) {
    return beneficiaryModel.findByIdAndDelete(id);
  }

  // getAgencyId(){

  // }
}

module.exports = new beneficiaryController();
