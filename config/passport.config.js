const { app } = require("../app");
const User = require("../database/models/user.model");
const passport = require("passport");
const MaskData = require("maskdata");
require("dotenv").config();
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
// const ExtractJwt = require("passport-jwt").ExtractJwt;
require("dotenv").config();
const {
  findUserPerEmail,
  findUserPerId,
  findUserPerGoogleId,
  findUserPerFacebookId,
} = require("../queries/users.queries");

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await findUserPerId(id);
    done(null, user);
  } catch (e) {
    done(e);
  }
});

const emailMask2Options = {
  maskWith: "*",
  unmaskedStartCharactersBeforeAt: 3,
  unmaskedEndCharactersAfterAt: 2,
  maskAtTheRate: false,
};

// Cette stratégie est utilisée pour la phase de connexion où l'utilisateur fournit son email et son mot de passe
passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      try {
        // Masquer l'email avant de chercher l'utilisateur dans la base de données
        const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);
        const user = await findUserPerEmail(maskedEmail);

        if (user) {
          const match = await user.comparePassword(password);
          if (match) {
            done(null, user);
          } else {
            done(null, false, { message: "Mot de passe incorrect" });
          }
        } else {
          done(null, false, { message: "Utilisateur non trouvé" });
        }
      } catch (e) {
        done(e);
      }
    }
  )
);

const cookieExtractor = function (req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

//la stratégie JWT est utilisée pour protéger les routes après que l'utilisateur est authentifié
passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.userId);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/cb",
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(util.inspect(profile, { compact: true, depth: 5, breakLength: 80 }));
      try {
        const user = await findUserPerGoogleId(profile.id);
        if (user) {
          done(null, user);
        } else {
          const newUser = new User({
            username: profile.displayName,
            local: {
              googleId: profile.id,
              email: profile.emails[0].value,
            },
          });
          const savedUser = await newUser.save();
          done(null, savedUser);
        }
      } catch (e) {
        done(e);
      }
    }
  )
);

passport.use(
  "facebook",
  new FacebookStrategy(
    {
      clientID: "clientId",
      clientSecret: "clientSecret",
      callbackURL: "auth/facebook/cb",
    },
    async (accessToken, refreshToken, profile, done) => {
      // console.log(util.inspect(profile, { compact: true, depth: 5, breakLength: 80 }));
      try {
        const user = await findUserPerFacebookId(profile.id);
        if (user) {
          done(null, user);
        } else {
          const newUser = new User({
            username: profile.displayName,
            local: {
              googleId: profile.id,
              email: profile.emails[0].value,
            },
          });
          const savedUser = await newUser.save();
          done(null, savedUser);
        }
      } catch (e) {
        done(e);
      }
    }
  )
);
