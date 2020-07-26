const router = require("express").Router();
const RoleController = require("./role.controller");
const { SecureAPI } = require("../../helpers/utils/secure");
const { ERR, PM } = require("../../helpers");

router.get("/", async (req, res, next) => {
  let limit = req.query.limit || 20;
  let start = req.query.start || 0;
  let name = req.query.name || null;
  RoleController.listRoles({
    limit,
    start,
    name
  })
    .then(d => res.json(d))
    .catch(e => next(e));
});

router.post("/", (req, res, next) => {
  RoleController.add(req.body)
    .then(d => res.json(d))
    .catch(e => next(e));
});

router.get("/:id", async (req, res, next) => {
  RoleController.get(req.params.id)
    .then(d => res.json(d))
    .catch(e => next(e));
});

router.delete("/:id", (req, res, next) => {
  RoleController.remove(req.params.id)
    .then(d => res.json(d))
    .catch(e => next(e));
});

router.get("/:name/permissions", async (req, res, next) => {
  try {
    let permissions = await RoleController.calculatePermissions(req.params.name);
    let data = [];
    data = [...permissions];
    let total = data.length;
    data = data.map(d => {
      return {
        permissions: d
      };
    });
    res.json({ data, total });
  } catch (e) {
    next(e);
  }
});

router.post("/:id/permissions", (req, res, next) => {
  RoleController.addPermission({ id: req.params.id, permissions: req.body.permissions })
    .then(d => res.json(d))
    .catch(e => next(e));
});

router.delete("/:id/permissions", (req, res, next) => {
  RoleController.removePermission({ id: req.params.id, permissions: req.body.permissions })
    .then(d => res.json(d))
    .catch(e => next(e));
});

module.exports = router;
