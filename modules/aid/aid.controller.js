const mongoose = require('mongoose');
const aidModel = require('./aid.model');
const { DataUtils } = require('../../helpers/utils');

const { ObjectId } = mongoose.Types;

class AidController {
  add(payload) {
    return aidModel.create(payload);
  }

  list(userId, { start = 0, limit = 50 }) {
    const query = { hosted_by: userId };
    return DataUtils.paging({
      start,
      limit,
      sort: { name: 1 },
      model: aidModel,
      query: [{ $match: { hosted_by: ObjectId(userId) } }],
    });
  }

  listAll({ start = 0, limit = 50 }) {
    const query = [];
    query.push(
      {
        $lookup: {
          from: 'users',
          localField: 'hosted_by',
          foreignField: '_id',
          as: 'host',
        },
      },
      {
        $lookup: {
          from: 'agencies',
          localField: 'hosted_by',
          foreignField: 'owned_by',
          as: 'agency',
        },
      },
      {
        $unwind: {
          path: '$host',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: '$agency',
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          eth_address: 1,
          host: '$host.name.first',
          user_address: '$host.eth_address',
          token_address: '$agency.token.eth_address',
        },
      },
    );
    return DataUtils.paging({
      start,
      limit,
      sort: { name: 1 },
      model: aidModel,
      query,
    });
  }

  async getById(id) {
    return await aidModel.findById(id);
  }

  update(id, payload) {
    return aidModel.findByIdAndUpdate(id, payload, {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    });
  }

  remove(id) {
    return aidModel.findByIdAndDelete(id);
  }

  async enrollBeneficiary(aidId, beneficiary, claimable = 0) {
    const data = Object.assign(beneficiary, { claimable });

    return aidModel.findOneAndUpdate(
      {
        _id: aidId,
      },
      {
        $addToSet: {
          beneficiaries: data,
        },
      },
      {
        new: true,
      },
    );
  }

  updateClaimables(aidId, beneficiaryId, claimable) {
    return aidModel.findOneAndUpdate(
      {
        _id: aidId,
        'beneficiaries.beneficiary': beneficiaryId,
      },
      {
        $set: {
          'beneficiaries.$.claimable': claimable,
        },
      },
      {
        new: true,
      },
    );
  }

  enrollVendor(aidId, vendor) {
    return aidModel.findOneAndUpdate(
      {
        _id: aidId,
      },
      {
        $addToSet: {
          vendors: vendor,
        },
      },
      {
        new: true,
      },
    );
  }

  async listBeneficiaries(aidId) {
    try {
      const { beneficiaries } = await aidModel
        .findOne({ _id: aidId }, 'beneficiaries')
        .populate('beneficiaries.beneficiary');

      const beneficiary = await beneficiaries.map((el) => {
        let ben = {};
        const {
          _id, name, phone, email, address,
        } = el.beneficiary;
        ben = {
          _id, name, phone, email, address, claimable: el.claimable,
        };

        return ben;
      });

      return beneficiary;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async listVendors(aidId) {
    try {
      const list = await aidModel.findOne({ _id: aidId }, 'vendors').populate('vendors.vendor');
      const vendor = list.vendors.map((el) => el.vendor);
      return vendor;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
}

module.exports = new AidController();
