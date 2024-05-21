const passport = require("passport");
const jwt = require("jsonwebtoken");

exports.signinForm = (req, res, next) => {
  res.render("auth/auth-form", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
  });
};

exports.signin = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("auth/auth-form", {
        errors: [info.message],
        isAuthenticated: req.isAuthenticated(),
        currentUser: req.user,
      });
    }
    req.login(user, err => {
      if (err) {
        return next(err);
      }
      try {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "24h",
        });

        res.cookie("jwt", token, {
          httpOnly: true, // Empêche l'accès par JavaScript côté client
          secure: true, // Envoie uniquement sur HTTPS
          sameSite: "Strict", // Empêche les requêtes intersites });
        });
        res.redirect("/waves");
      } catch (e) {
        return next(e);
      }
    });
  })(req, res, next);
};

exports.signout = (req, res, next) => {
  req.logout(err => {
    if (err) {
      return next(err);
    }
    res.redirect("/auth/signin/form");
  });
};

exports.googleAuth = (req, res, next) => {
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })(req, res, next);
};

exports.googleAuthCb = (req, res, next) => {
  passport.authenticate("google", {
    successRedirect: "/waves",
    failureRedirect: "/",
  })(req, res, next);
};

exports.facebookAuth = (req, res, next) => {
  passport.authenticate("facebook", {
    scope: ["email", "profile"],
  })(req, res, next);
};

exports.facebookAuthCb = (req, res, next) => {
  passport.authenticate("facebook", {
    successRedirect: "/waves",
    failureRedirect: "/",
  })(req, res, next);
};
