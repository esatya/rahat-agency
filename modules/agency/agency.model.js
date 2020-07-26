const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const agencySchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    eth_address: { type: String, required: true, trim: true },
    owned_by: { type: ObjectId, ref: 'User' },
    approve: { type: Boolean, default: false },
    token: {
      name: { type: String },
      symbol: { type: String },
      eth_address: { type: String, trim: true },
      supply: { type: Number },
      onChain: { type: Boolean, default: false },
    },
    aids: [
      {
        aid: { type: ObjectId, ref: 'Aid' },
        fund: { type: Number },
        onChain: { type: Boolean, default: false },
      },
    ],
    onChain: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

agencySchema.index(
  {
    name: 1,
    eth_address: 1,
  },
  { unique: true, dropDups: true },
);

module.exports = mongoose.model('Agency', agencySchema);
