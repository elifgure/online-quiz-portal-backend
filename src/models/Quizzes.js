const mongoose = require("mongoose");
const Question = require("./Questions")

/**
 * @swagger
 * components:
 *   schemas:
 *     Quiz:
 *       type: object
 *       required:
 *         - title
 *         - duration
 *         - category
 *         - questions
 *         - createdBy
 *       properties:
 *         title:
 *           type: string
 *           description: Quiz başlığı
 *         duration:
 *           type: number
 *           description: Quiz süresi (dakika)
 *           minimum: 1
 *         category:
 *           type: string
 *           description: Quiz kategorisi
 *         questions:
 *           type: array
 *           items:
 *             type: string
 *             description: Soru ID'leri
 *         createdBy:
 *           type: string
 *           description: Quizi oluşturan kullanıcının ID'si
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Oluşturulma tarihi
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Son güncelleme tarihi
 */

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
// ❗ Quiz silindiğinde ilişkili soruları da sil
quizSchema.pre("findOneAndDelete", async function (next) {
  const quizId = this.getQuery()._id
  await Question.deleteMany({quiz: quizId})
  next()
})

module.exports = mongoose.model("Quiz", quizSchema);