const txModel = require("./transaction.model");
const { DataUtils } = require("../../helpers/utils");

class TransactionController {
  add(payload) {
    return txModel.create(payload);
  }

  list({ start = 0, limit = 50 }) {
    return DataUtils.paging({
      start,
      limit,
      sort: { createdAt: 1 },
      model: txModel,
      query: []
    });
  }

  async getById(id) {
    return await txModel.findById(id);
  }

  remove(id) {
    return txModel.findByIdAndDelete(id);
  }

  async getOrigin(txId) {
    try {
      console.log(txId);
      let tx = await txModel.findOne({ _id: txId }).populate("origin");

      console.log(tx);

      return tx.origin;
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  async broadcastTransaction(txId, payload) {
    console.log(payload);
    try {
      let tx = await txModel.findOneAndUpdate(
        { _id: txId },
        {
          $set: {
            broadcast: true,
            sender: payload.sender,
            txSignature: payload.txSignature,
            rawTx: payload.rawTx
          }
        },
        { new: true }
      );
      console.log(tx);
      return tx;
    } catch (e) {
      return e;
    }
  }
}

module.exports = new TransactionController();
