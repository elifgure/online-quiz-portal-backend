const mongoose = require("mongoose");
const Question = require("./Questions")

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