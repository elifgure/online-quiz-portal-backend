const {body} = require("express-validator")

const questionValidators = [
    body("type").isIn(["multiple-choice", "true-false", "text"]),
    body("questionText").notEmpty().withMessage("Soru metni gerekli"),
    body("correctAnswer").custom((value, { req }) => {
    if (req.body.type === "multiple-choice" && !Array.isArray(value)) {
      throw new Error("Multiple choice cevap array olmalı");
    }
    if (req.body.type === "true-false" && typeof value !== "boolean") {
      throw new Error("True/False cevap boolean olmalı");
    }
    if (req.body.type === "text" && typeof value !== "string") {
      throw new Error("Text cevap string olmalı");
    }
    return true;
  })
]

module.exports = {questionValidators}