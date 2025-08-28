const mongoose = require("mongoose");


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