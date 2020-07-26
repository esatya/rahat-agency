const router = require("express").Router();
const transactionController = require("./transaction.controller");

router.post("/", async (req, res) => {
  let payload = req.body;
  try {
    let tx = await transactionController.add(payload);
    res.json(tx);
  } catch (e) {
    res.json(e);
  }
});

router.get("/:id/origin", async (req, res) => {
  let txId = req.params.id;
  try {
    console.log(txId);
    let origin = await transactionController.getOrigin(txId);
    console.log(origin);
    res.json(origin);
  } catch (e) {
    res.json(e);
  }
});
router.get("/:id", async (req, res) => {
  let txId = req.params.id;
  try {
    console.log(txId);
    let tx = await transactionController.getById(txId);
    console.log(tx);
    res.json(tx);
  } catch (e) {
    res.json(e);
  }
});

router.get("/", async (req, res) => {
  let limit = req.query.limit || 20;
  let start = req.query.start || 0;

  try {
    let tx = await transactionController.list({
      start,
      limit
    });
    res.json(tx);
  } catch (e) {
    res.json(e);
  }
});

router.post("/:id/transact", async (req, res) => {
  let txId = req.params.id;
  try {
    let tx = await transactionController.broadcastTransaction(txId, req.body);
    res.json(tx);
  } catch (e) {
    res.json(e);
  }
});

module.exports = router;
