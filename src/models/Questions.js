const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Option:
 *       type: object
 *       required:
 *         - text
 *       properties:
 *         text:
 *           type: string
 *           description: Şık metni
 *         isCorrect:
 *           type: boolean
 *           description: Şıkkın doğru cevap olup olmadığı
 *           default: false
 * 
 *     Question:
 *       type: object
 *       required:
 *         - quiz
 *         - type
 *         - questionText
 *       properties:
 *         quiz:
 *           type: string
 *           description: Sorunun ait olduğu quiz ID'si
 *         type:
 *           type: string
 *           enum: [multiple-choice, true-false, text]
 *           description: Soru tipi
 *         questionText:
 *           type: string
 *           description: Soru metni
 *         options:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Option'
 *           description: Çoktan seçmeli sorular için şıklar
 *         correctAnswer:
 *           type: object
 *           description: Soru tipine göre doğru cevap (array, boolean veya string)
 */

// Şıklar için schema
const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    default: false,
  },
});

// Sorular için schema
const questionSchema = new mongoose.Schema(
  {
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    // Soru Tipleri
    type: {
      type: String,
      enum: ["multiple-choice", "true-false", "text"],
      required: true,
    },
    // Sorular
    questionText: {
      type: String,
      required: true,
    },
    // Çoktan seçmeli için seçenekler
    options: [optionSchema],
    correctAnswer: {
      type: mongoose.Schema.Types.Mixed,
      validate: {
        validator: function (value) {
          if (this.type === "multiple-choice" && !Array.isArray(value)) {
            return false;
          }
          if (this.type === "true-false" && typeof value !== "boolean") {
            return false;
          }
          if (this.type === "text" && typeof value !== "string") {
            return false;
          }
          return true;
        },
        message: "Correct answer tipi, question type ile eşleşmiyor.",
      },
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Question", questionSchema)