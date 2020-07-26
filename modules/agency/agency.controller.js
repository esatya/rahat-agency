const mongoose = require('mongoose');
const agencyModel = require('./agency.model');
const { DataUtils } = require('../../helpers/utils');

const { ObjectId } = mongoose.Schema;

// const { UserManager } = require("rs-user");

class AgencyController {
  add(payload) {
    return agencyModel.create(payload);
  }

  list({ start = 0, limit = 50 }) {
    return DataUtils.paging({
      start,
      limit,
      sort: { name: 1 },
      model: agencyModel,
      query: [],
    });
  }

  async getById(id) {
    return await agencyModel.findById(id);
  }

  remove(id) {
    return agencyModel.findByIdAndDelete(id);
  }

  async addToken(agencyId, payload) {
    return agencyModel.findOneAndUpdate(
      { _id: agencyId },
      { $set: { token: payload } },
      { new: true },
      (err, doc) => {
        if (err) {
          console.log(err);
          return err;
        }
        return doc;
      },
    );
  }

  addAid(userId, aid_id, fund) {
    const aid = {
      aid: aid_id,
      fund,
    };

    return agencyModel.findOneAndUpdate(
      { owned_by: userId },
      {
        $addToSet: {
          aids: aid,
        },
      },
      {
        new: true,
      },
    );
  }

  async getCurrentId(userId) {
    try {
      const agency = await agencyModel.findOne({ owned_by: userId });

      return agency._id;
    } catch (e) {
      console.log('error', e);
    }
  }

  async approveAgency(agencyId) {
    const { owned_by } = await agencyModel.findOne({ _id: agencyId });

    return agencyModel.findOneAndUpdate(
      { _id: agencyId },
      { approve: true },
      { new: true },
      (err, doc) => {
        if (err) {
          return err;
        }
        return doc;
      },
    );
  }
}

module.exports = new AgencyController();
