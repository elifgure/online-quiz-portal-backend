const { body } = require("express-validator");

const registerValidators = [
  body("name")
    .notEmpty()
    .withMessage("İsim Zorunludur")
    .isLength({ min: 2, max: 30 }),
  body("email")
    .isEmail()
    .notEmpty()
    .withMessage("Geçerli email giriniz")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Şifre en az 8 karakter olmalıdır.")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Şifre en az bir küçük harf, bir büyük harf ve bir rakam içermelidir"
    ),
];

const loginValidators = [
  body("email")
    .isEmail()
    .withMessage("Geçerli bir email adresi giriniz")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Şifre zorunlu"),
];

const refreshValidators = [
    body("refreshToken")
    .notEmpty()
    .withMessage('Refresh Token Zorunlu.')
]

module.exports = {
    registerValidators,
    loginValidators,
    refreshValidators
}