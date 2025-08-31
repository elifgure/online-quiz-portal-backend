const { body } = require("express-validator");

const quizValidators = [
  body("title")
    .notEmpty()
    .withMessage("Quiz başlığı gerekli")
    .isString()
    .withMessage("Başlık string olmalı"),
  body("duration")
    .notEmpty()
    .withMessage("Quiz süresi gerekli")
    .isInt({ min: 1 })
    .withMessage("Süre en az 1 dakika olmalı"),
  body("category")
    .notEmpty()
    .withMessage("Kategori gerekli")
    .isString()
    .withMessage("Kategori string olmalı"),
  body("questions")
    .isArray({ min: 1 })
    .withMessage("Quiz için en az 1 soru eklenmeli"),
];
module.exports = { quizValidators };
