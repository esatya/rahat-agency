const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const transactionSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    sender: { type: String },
    encodedTx: { type: String },
    contract: { type: String },
    rawTx: { type: String },
    txSignature: { type: Object },
    origin: { type: ObjectId, refPath: "originModel" },
    originModel: { type: String, enum: ["Beneficiary", "Agency", "Vendor", "Aid"] },
    broadcast: { type: Boolean, default: false }
  },
  {
    timestamps: true
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

module.exports = mongoose.model("Transaction", transactionSchema);
