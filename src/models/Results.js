const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     Answer:
 *       type: object
 *       required:
 *         - questionId
 *         - userAnswer
 *         - isCorrect
 *       properties:
 *         questionId:
 *           type: string
 *           description: Soru ID'si
 *         userAnswer:
 *           type: object
 *           description: Kullanıcının verdiği cevap
 *         isCorrect:
 *           type: boolean
 *           description: Cevabın doğru olup olmadığı
 * 
 *     Result:
 *       type: object
 *       required:
 *         - student
 *         - quiz
 *         - answers
 *         - score
 *         - totalQuestions
 *         - correctAnswers
 *       properties:
 *         student:
 *           type: string
 *           description: Öğrenci ID'si
 *         quiz:
 *           type: string
 *           description: Quiz ID'si
 *         answers:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Answer'
 *           description: Verilen cevaplar
 *         score:
 *           type: number
 *           description: Alınan puan
 *         totalQuestions:
 *           type: number
 *           description: Toplam soru sayısı
 *         correctAnswers:
 *           type: number
 *           description: Doğru cevap sayısı
 *         completedAt:
 *           type: string
 *           format: date-time
 *           description: Tamamlanma tarihi
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma tarihi
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Son güncelleme tarihi
 */

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
