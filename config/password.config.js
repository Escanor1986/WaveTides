const passwordValidator = require("password-validator");
const passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(10) // Minimum length 10
  .is()
  .max(100) // Maximum length 100
  .has()
  .uppercase() // Must have uppercase letters
  .has()
  .lowercase() // Must have lowercase letters
  .has()
  .digits(2) // Must have at least 2 digits
  .has()
  .not()
  .spaces() // Should not have spaces
  .oneOf(["Passw0rd", "Password123", "123456789", "iLoveYou", "Master"]) // liste noir des valeurs interdites
  .is()
  .not((value, { req, location, path }) => {
    // Vérifie que le mot de passe ne contient pas d'informations sensibles
    const username = req.body.username;
    const email = req.body.email;
    return (
      value.includes(username) ||
      value.includes(email) ||
      value.toLowerCase().includes("password")
    );
  });

module.exports = passwordSchema;
