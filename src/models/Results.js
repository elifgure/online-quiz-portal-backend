const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  userAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
  isCorrect: { type: Boolean, required: true },
});

const resultSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    answers: [answerSchema],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
// İstatistik hesaplama metodu
resultSchema.methods.calculateStats = function () {
  return {
    score: this.score,
    totalQuestions: this.totalQuestions,
    correctAnswers: this.correctAnswers,
    percentage: ((this.correctAnswers / this.totalQuestions) * 100).toFixed(2),
  };
};
module.exports = mongoose.model("Result", resultSchema);
