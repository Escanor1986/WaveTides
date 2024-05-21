const passwordValidator = require("password-validator");
const passwordSchema = new passwordValidator();

// Définition des règles de validation du mot de passe
passwordSchema
  .is()
  .min(10) // Longueur minimale de 10 caractères
  .is()
  .max(100) // Longueur maximale de 100 caractères
  .has()
  .uppercase() // Doit contenir des lettres majuscules
  .has()
  .lowercase() // Doit contenir des lettres minuscules
  .has()
  .digits(2) // Doit contenir au moins 2 chiffres
  .has()
  .not()
  .spaces() // Ne doit pas contenir d'espaces
  .has()
  .symbols(2) // Doit contenir au moins 2 caractères spéciaux
  .not()
  .oneOf(["Passw0rd", "Password123", "123456789", "iLoveYou", "Master"]); // Valeurs interdites

module.exports = passwordSchema;
