const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Toutes les 15 minutes
  max: 30,
  message: "Too many connection requests, please try again later.",
});

exports.ensureAuthenticated = (req, res, next) => {
  // Limite les tentatives de connexion
  authLimiter(req, res, () => {
    // vérifie si l'utilisateur est authentifié
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(403).redirect("/auth/signin/form");
    }
  });
};
