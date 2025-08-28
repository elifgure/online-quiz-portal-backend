const Question = require("../models/Questions");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// Yeni Soru Oluşturma
const createQuestion = asyncHandler(async (req, res, next) => {
  const { quiz, type, questionText, options, correctAnswer } = req.body;

  if (!quiz || !type || !questionText) {
    return next(new ApiError(400, "Quiz, type ve questionText zorunludur"));
  }

  const question = new Question({
    quiz,
    type,
    questionText,
    options,
    correctAnswer,
  });
  await question.save();
  res.status(200).json(new ApiResponse(200, "Soru Oluşturuldu", question));
});



// Soru Güncelleme
const updateQuestion = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { quiz, type, questionText, options, correctAnswer } = req.body;

  const updateData = {};
  if (quiz) updateData.quiz = quiz;
  if (type) updateData.type = type;
  if (questionText) updateData.questionText = questionText;
  if (options) updateData.options = options;
  if (correctAnswer !== undefined) updateData.correctAnswer = correctAnswer;

  const question = await Question.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!question) {
    return next(new ApiError(404, "Soru Bulunamadı"));
  }
  res
    .status(201)
    .json(new ApiResponse(201, "Soru Başarıyla Güncellendi", question));
});

module.exports = {
  createQuestion,
  updateQuestion,
};
