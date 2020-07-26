const passport = require("passport");
const router = require("express").Router();
const UserController = require("./user.controller");

router.get("/login", (req, res, next) => {
  res.render("auth/login", { title: "Login" });
});

router.post("/login", async (req, res, next) => {
  try {
    let user = await UserController.login(req.body);
    res.cookie("access_token", user.token);
    res.json({ access_token: user.token });
  } catch (e) {
    next(e);
  }
});

router.get("/auth", async (req, res, next) => {
  try {
    const token = req.query.access_token || req.headers["access_token"] || req.cookies.access_token;
    let tokenData = await UserController.validateToken(token);
    let user = await UserController.getById(tokenData.data.user_id);
    res.json({
      user,
      access_token: token,
      permissions: tokenData.data.permissions
    });
  } catch (e) {
    next(e);
  }
});

router.post("/auth", async (req, res, next) => {
  try {
    let user = await UserController.login(req.body);
    let tokenData = await UserController.validateToken(user.token);
    res.json({
      user,
      access_token: user.token,
      permissions: tokenData.data.permissions
    });
  } catch (e) {
    next(e);
  }
});

router.get("/logout", (req, res, next) => {
  res.clearCookie("access_token");
  res.clearCookie("redirect_url");
  res.redirect("/login");
});

router.get("/register", (req, res, next) => {
  res.render("auth/register", { title: "Register" });
});

router.get("/passport-control", async (req, res, next) => {
  try {
    let tokenData = await UserController.validateToken(req.cookies.access_token);
    res.render("auth/passport-control", {
      title: "Passport Control",
      access_token: req.cookies.access_token,
      redirect_url: req.cookies.redirect_url,
      user_fname: tokenData.data.name_first,
      user_name: tokenData.data.name
    });
  } catch (e) {
    res.clearCookie("access_token");
    res.redirect("/login");
  }
});

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    scope: ["email"]
  }),
  (req, res, next) => {}
);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    userProperty: {}
  })
);

router.post("/nonce", async (req, res, next) => {
  let { eth_address } = req.body;
  try {
    let nonce = await UserController.getNonce(eth_address);
    console.log(nonce);
    res.json({ nonce });
  } catch (e) {
    next(e);
  }
});

router.post("/auth/metamask", async (req, res, next) => {
  let { signature, eth_address } = req.body;
  if (!signature || !eth_address)
    return res.status(400).send({ error: "Request should have signature and publicAddress" });
  try {
    eth_address = eth_address.toLowerCase();
    console.log("address", eth_address);
    console.log("signature", signature);
    let user = await UserController.loginMetamask({ signature, eth_address });

    res.cookie("access_token", user.token);
    res.json({ access_token: user.token });
  } catch (e) {
    next(e);
  }
});

router.get("/auth/:strategy/callback", async (req, res, next) => {
  __promisifiedPassportAuthentication(req.params.strategy, req, res)
    .then(async d => {
      res.cookie("access_token", d.token);
      res.redirect("/passport-control");
    })
    .catch(e => next(e));
});

function __promisifiedPassportAuthentication(strategy, req, res) {
  return new Promise((resolve, reject) => {
    passport.authenticate(strategy, { session: false }, (err, user) => {
      if (err) reject(new Error(err));
      else if (!user) reject(new Error("Not authenticated"));
      resolve(user);
    })(req, res);
  });
}

module.exports = router;
