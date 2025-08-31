const Result = require("../models/Results");
const Question = require("../models/Questions");
const Quiz = require("../models/Quizzes");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// Sonuç Oluşturma
const createResult = asyncHandler(async (req, res, next) => {
  const { quizId, answers } = req.body;
  const studentId = req.user._id;
  // Quizi Getir
  const quiz = await Quiz.findById(quizId);
  if (!quiz) return next(new ApiError(404, "Quiz Bulunamadı"));
  // Quizdeki soruları çek
  const questions = await Question.find({ _id: { $in: quiz.questions } });
  // Cevapları işle
  let correctAnswersCount = 0;
  const processedAnswers = answers.map((answer) => {
    const question = questions.find(q => q._id.toString() === answer.questionId);
    if (!question) return next(new ApiError(400, "Geçersiz soru ID'si"));
    let isCorrect = false;
    // Soru tipine göre kontrol
    if (question.type === "multiple-choice") {
      if (answer.userAnswer === question.correctAnswer) {
        isCorrect = true;
      }
    } else if (question.type === "true-false") {
      if (answer.userAnswer === question.correctAnswer) {
        isCorrect = true;
      }
    } else if (question.type === "text") {
      if (
        typeof answer.userAnswer === "string" &&
        answer.userAnswer.trim().toLowerCase() ===
          question.correctAnswer.trim().toLowerCase()
      ) {
        isCorrect = true;
      }
    }
    if (isCorrect) correctAnswersCount++;

    return {
      questionId: question._id,
      userAnswer: answer.userAnswer,
      isCorrect,
    };
  });
  // 4) Skor hesapla
  const totalQuestions = questions.length;
  const score = Math.round((correctAnswersCount / totalQuestions) * 100);
  // 5) Sonucu kaydet
  const result = await Result.create({
    student: studentId,
    quiz: quiz._id,
    answers: processedAnswers,
    score,
    totalQuestions,
    correctAnswers: correctAnswersCount,
  });

  res.status(201).json(new ApiResponse(201, "Sonuçlar", result));
});
// Öğrenci sonuçlarının listelenmesi
const getMyResults = asyncHandler(async (req, res, next) => {
  const results = await Result.find({ userId: req.user._id })
    .populate("quiz", "title")
    .sort({ createdAt: -1 });
  if (!results || results.length === 0) {
    return next(new ApiError(404, "Henüz çözülmüş bir quiz bulunamadı"));
  }
  res.status(200).json(new ApiResponse(200, "Sonuçlar listelendi", results));
});
// Öğrenci İçin sonuç detayları görüntüleme
const getResultById = asyncHandler(async (req, res, next) => {
  const result = await Result.findById(req.params.id)
    .populate("quiz", "title")
    .populate("student", "name email");
  if (!result) return next(new ApiError(404, "Sonuç Bulunamadı"));
  res.status(200).json(new ApiResponse(200, "Quiz Sonucu", result));
});
// Öğretmen için sonuçların listelenmesi
const getMyQuizResults = asyncHandler(async (req, res, next) => {
  //  önce quizleri bul
  const myQuizzes = await Quiz.find({ createdBy: req.user._id }).select("_id");
  if (!myQuizzes || myQuizzes.length === 0) {
    return next(new ApiError(404, "Henüz quiz oluşturmadınız"));
  }
  // bu quizlere ait sonuçları getir
  const results = await Result.find({ quiz: { $in: myQuizzes } })
    .populate("quiz", "title")
    .populate("student", "name email".sort({ createdAt: -1 }));
  res.status(200).json(new ApiResponse(200, "Quiz Sonuçlarım", results));
});
// Öğretmen için quiz detayları
const getResultForTeacher = asyncHandler(async (req, res, next) => {
  const result = await Result.findById(req.params.id)
    .populate("quiz", "title createdBy")
    .populate("student", "name email");
  if (!result) return next(new ApiError(404, "Sonuç Bulunamadı"));
  // Güvenlik
  if (result.quiz.createdBy.toString() !== req.user._id.toString()) {
    return next(new ApiError(403, "Bu sonuca erişim yetkiniz yok"));
  }
  res.status(200).json(new ApiResponse(200, "Sonuç Detayı", result));
});
// Admin için tüm sonuçlar
const getAllResults = asyncHandler(async (req, res, next) => {
  const results = await Result.find()
    .populate("quiz", "title description duration category createdBy")
    .populate("student", "name email")
    .sort({ createdAt: -1 });

  res
    .status(200)
    .json(new ApiResponse(200, "Tüm Sonuçlar listelendi", results));
});
module.exports = {
  createResult,
  getMyResults,
  getMyQuizResults,
  getResultById,
  getResultForTeacher,
  getAllResults,
};
