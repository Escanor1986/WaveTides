const {
  createUser,
  findUserPerUsername,
  searchUsersPerUsername,
  addUserIdToCurrentUserFollowing,
  removeUserIdToCurrentUserFollowing,
  findUserPerId,
} = require("../queries/users.queries");
const path = require("path");
const { getUserWavesFromAuthorId } = require("../queries/waves.queries");
const { validationResult } = require("express-validator");
const passwordSchema = require("../config/password.config");
const emailValidator = require("email-validator");
const multer = require("multer");
const date = new Date();

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "../public/images/avatars"));
    },
    filename: (req, file, cb) => {
      cb(
        null,
        `${date.toDateString().split(" ").join("_")}-${file.originalname}`
      );
    },
  }),
});

exports.signupForm = (req, res, next) => {
  res.render("users/user-form", {
    errors: null,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user,
  });
};

exports.signup = async (req, res, next) => {
  const body = req.body;
  try {
    // Vérification de la structure de l'adresse email
    if (!emailValidator.validate(body.email)) {
      throw new Error("Invalid email format");
    }
    // Création de l'objet contenant les détails de/des erreurs
    const passwordValidationErrors = passwordSchema.validate(body.password, {
      details: true,
    });
    // Vérification de la structure du password AVANT d'invoquer createUser
    // Affichage des erreurs si besoin
    if (passwordValidationErrors.length > 0) {
      console.log(passwordValidationErrors);
      throw new Error(passwordValidationErrors[0].message);
    }

    const user = await createUser(body);
    console.log(user);
    res.render("auth/auth-form");
  } catch (e) {
    res.render("users/user-form", {
      errors: [e.message],
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
    });
  }
};

exports.uploadImage = [
  upload.single("avatar"),
  async (req, res, next) => {
    try {
      const user = req.user;
      user.avatar = `/images/avatars/${req.file.filename}`;
      await user.save();
      res.redirect("/");
    } catch (e) {
      next(e);
    }
  },
];

exports.userProfile = async (req, res, next) => {
  try {
    const username = req.params.username;
    const user = await findUserPerUsername(username);
    const waves = await getUserWavesFromAuthorId(user._id);
    res.render("waves/wave", {
      waves,
      isAuthenticated: req.isAuthenticated(),
      currentUser: req.user,
      user,
      editable: false,
    });
  } catch (e) {
    next(e);
  }
};

exports.userList = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const search = req.query.search;
    const users = await searchUsersPerUsername(search);
    res.render("includes/search-menu", { users });
  } catch (e) {
    next(e);
  }
};

exports.followUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const [, user] = await Promise.all([
      addUserIdToCurrentUserFollowing(req.user, userId),
      findUserPerId(userId),
    ]);
    res.redirect(`/users/${user.username}`);
  } catch (e) {
    next(e);
  }
};

exports.unFollowUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const [, user] = await Promise.all([
      removeUserIdToCurrentUserFollowing(req.user, userId),
      findUserPerId(userId),
    ]);
    res.redirect(`/users/${user.username}`);
  } catch (e) {
    next(e);
  }
};
