const router = require("express").Router();
const UserController = require("./user.controller");
const { SecureAPI } = require("../../helpers/utils/secure");
const { PM, ERR } = require("../../helpers");

router.get("/", SecureAPI(PM.USER_READ), (req, res, next) => {
  let limit = req.query.limit || 20;
  let start = req.query.start || 0;

  UserController.list({
    limit,
    start,
    search: req.query.search
  })
    .then(docs => res.json(docs))
    .catch(next);
});

router.post("/", SecureAPI(), (req, res, next) => {
  UserController.createUsingEmail(req.body)
    .then(u => res.json(u))
    .catch(e => next(e));
});

router.post("/login", (req, res, next) => {
  let payload = Object.assign({}, req.body);
  if (req.body.remember === true) payload.jwtDuration = config.get("jwt.duration_long");

  UserController.authenticate(payload)
    .then(u => res.json(u))
    .catch(e => next(e));
});

router.get("/me", SecureAPI(), (req, res, next) => {
  UserController.getById(req.tokenData.user_id)
    .then(u => res.json(u))
    .catch(e => next(e));
});

router.get("/:id", SecureAPI(), (req, res, next) => {
  UserController.getById(req.params.id)
    .then(d => res.json(d))
    .catch(e => next(e));
});

router.post("/:id/status", SecureAPI(PM.USER_UPDATE), (req, res, next) => {
  UserController.changeStatus(req.params.id, req.body.is_active)
    .then(d => res.json(d))
    .catch(next);
});

router.post("/:id/roles", SecureAPI(), (req, res, next) => {
  UserController.addRoles({
    user_id: req.params.id,
    roles: req.body.roles
  })
    .then(d => res.json(d))
    .catch(e => next(e));
});

router.delete("/:id/roles", SecureAPI(), (req, res, next) => {
  UserController.removeRole({
    user_id: req.params.id,
    role: req.body.role
  })
    .then(d => res.json(d))
    .catch(e => next(e));
});

module.exports = router;
