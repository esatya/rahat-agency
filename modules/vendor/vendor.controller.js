const mongoose = require('mongoose');
const vendorModel = require('./vendor.model');
const { DataUtils } = require('../../helpers/utils');

const { ObjectId } = mongoose.Types;

class vendorController {
  add(payload) {
    payload.eth_address = payload.eth_address.slice(0, 2) + payload.eth_address.slice(2).toUpperCase();
    console.log(payload);
    return vendorModel.create(payload);
  }

  list(agencyId, { start = 0, limit = 50 }) {
    return DataUtils.paging({
      start,
      limit,
      sort: { name: 1 },
      model: vendorModel,
      query: [{ $match: { agency: ObjectId(agencyId) } }],
    });
  }

  async getById(id) {
    return await vendorModel.findById(id);
  }

  remove(id) {
    return vendorModel.findByIdAndDelete(id);
  }

  async check(address) {
    return await vendorModel.exists({ eth_address: address });
  }
}

module.exports = new vendorController();
