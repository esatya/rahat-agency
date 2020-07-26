const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const aidSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    eth_address: { type: String, required: true, trim: true },
    hosted_by: { type: ObjectId, ref: 'User' },
    beneficiaries: [
      {
        beneficiary: { type: ObjectId, ref: 'Beneficiary' },
        claimable: { type: Number },
      },
    ],
    vendors: [
      {
        vendor: { type: ObjectId, ref: 'Vendor' },
      },
    ],
  },
  {
    timestamps: true,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

aidSchema.index(
  {
    name: 1,
    eth_address: 1,
  },
  { unique: true, dropDups: true },
);

module.exports = mongoose.model('Aid', aidSchema);
