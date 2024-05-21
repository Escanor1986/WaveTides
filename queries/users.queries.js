const User = require("../database/models/user.model");
const MaskData = require("maskdata");
const emailMask2Options = {
  maskWith: "*",
  unmaskedStartCharactersBeforeAt: 3,
  unmaskedEndCharactersAfterAt: 2,
  maskAtTheRate: false,
};

exports.createUser = async user => {
  try {
    // Hachage password
    const hashedPassword = await User.hashPassword(user.password);
    // Masquage de l'email avec option
    const maskedEmail = MaskData.maskEmail2(user.email, emailMask2Options);
    // Création du profil utilisateur destiné à la DB
    const newUser = new User({
      username: user.username,
      local: {
        email: maskedEmail,
        password: hashedPassword,
      },
    });
    // Sauvegarde de l'utilisateur dans la DB
    return await newUser.save();
  } catch (e) {
    console.error("Error creating user:", e.message);
    throw e;
  }
};

exports.findUserPerEmail = maskedEmail => {
  return User.findOne({ "local.email": maskedEmail }).exec();
};

exports.findUserPerId = id => {
  return User.findById(id).exec();
};

exports.findUserPerGoogleId = googleId => {
  return User.findOne({ "local.googleId": googleId }).exec();
};

exports.findUserPerFacebookId = facebookId => {
  return User.findOne({ "local.facebookId": facebookId }).exec();
};

exports.findUserPerUsername = username => {
  return User.findOne({ username }).exec();
};

exports.searchUsersPerUsername = async search => {
  const sanitizedSearch = search.slice(0, 20);

  return await User.find({
    username: { $regex: new RegExp(`^${sanitizedSearch}`) },
  }).exec();
};

exports.addUserIdToCurrentUserFollowing = (currentUser, userId) => {
  currentUser.following = [...currentUser.following, userId];
  return currentUser.save();
};

exports.removeUserIdToCurrentUserFollowing = (currentUser, userId) => {
  currentUser.following = currentUser.following.filter(
    objId => objId.toString() !== userId
  );
  return currentUser.save();
};
