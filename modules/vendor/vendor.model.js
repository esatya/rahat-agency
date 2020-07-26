const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const vendorSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    eth_address: { type: String, required: true, trim: true },
    address: { type: String },
    email: { type: String },
    phone: { type: Number, required: true },

    agency: { type: ObjectId, ref: 'Agency' },
  },
  {
    timestamps: true,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
vendorSchema.index(
  {
    eth_address: 1,
    agency: 1,
  },
  { unique: true, dropDups: true },
);

module.exports = mongoose.model('Vendor', vendorSchema);
