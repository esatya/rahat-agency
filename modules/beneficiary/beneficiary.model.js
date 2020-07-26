const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema;

const beneficiarySchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: Number, required: true },
    agency: { type: ObjectId, ref: 'Agency' },
    email: { type: String },
    address: { type: String },
  },
  {
    timestamps: true,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
beneficiarySchema.index(
  {
    phone: 1,
    agency: 1,
  },
  { unique: true, dropDups: true },
);

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
