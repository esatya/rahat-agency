const passport = require("passport");
const config = require("config");
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const UserController = require("../../modules/user/user.controller");

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: config.get("services.facebook.key"),
      clientSecret: config.get("services.facebook.secret"),
      callbackURL: config.get("app.url") + config.get("services.facebook.callback"),
      passReqToCallback: true,
      profileFields: [
        "id",
        "emails",
        "name",
        "displayName",
        "gender",
        "birthday",
        "picture.type(large)"
      ]
    },
    function(req, token, refreshToken, profile, done) {
      process.nextTick(function() {
        let pData = profile._json;
        let data = {
          service: "facebook",
          service_id: pData.id,
          extras: Object.assign(pData, {
            imageUrl: pData.picture.data.url
          })
        };
        UserController.loginExternal(data).then(d => {
          return done(null, d);
        });
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: config.get("services.google.key"),
      clientSecret: config.get("services.google.secret"),
      callbackURL: config.get("app.url") + config.get("services.google.callback"),
      passReqToCallback: true
    },
    function(req, token, refreshToken, profile, done) {
      process.nextTick(function() {
        let pData = profile._json;
        let data = {
          service: "google",
          service_id: profile.id,
          extras: Object.assign(pData, {
            name: pData.name,
            gender: pData.gender,
            imageUrl: pData.picture
          })
        };
        UserController.loginExternal(data).then(d => {
          return done(null, d);
        });
      });
    }
  )
);
