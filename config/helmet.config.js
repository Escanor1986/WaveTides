// helmetConfig.js
const helmet = require("helmet");

const helmetConfig = () => {
  const directives = {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    "script-src": [
      "'self'",
      "https://unpkg.com/",
      "https://kit.fontawesome.com/",
      "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js",
    ],
  };

  return [
    helmet(),
    helmet.hidePoweredBy(),
    helmet.frameguard({ action: "deny" }),
    helmet.ieNoOpen(),
    helmet.noSniff(),
    helmet.contentSecurityPolicy({ directives }),
    (req, res, next) => {
      res.setHeader(
        "Content-Security-Policy",
        "script-src 'self' https://unpkg.com/ https://kit.fontawesome.com/ https://cdn.jsdelivr.net/npm/"
      );
      next();
    },
  ];
};

module.exports = helmetConfig;
