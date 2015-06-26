module.exports = function (config, app, db) {
  var session = require('express-session');
  var passport = require('passport');
  var FacebookStrategy = require('passport-facebook').Strategy;

  passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: config.uri + '/oauth/facebook'
  }, function (accessToken, refreshToken, profile, done) {
    var data = profile._json;
    db.User.findOrCreate({
        where: {
          email: data.email
        },
        defaults: {
          firstName: data.first_name,
          lastName: data.last_name,
          email: data.email,
          access: 'user'
        }
      }).spread(function (user, created) {
        done(null, user);
      });
  }));

  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (user, done) {
    db.User.findById(user.id).then(function (fullUser) {
      done(null, fullUser);
    });
  });

  app.use(session({ secret: config.secret}));
  app.use(passport.initialize());
  app.use(passport.session());

  app.get('/login', passport.authenticate('facebook'));

  app.get('/oauth/facebook', passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/failure'
  }));

  return {
    loginRequired: function (req, res, next) {
      if (!req.user) res.sendStatus(401);
      else next();
    }
  }
};
