const Quiz = require("../models/Quizzes");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// Quizlerin Listelenmesi
const getQuizzes = asyncHandler(async (req, res, next) => {
  const user = req.user;
  if (!user) {
    return next(new ApiError(401, "Kullanıcı Bulanamadı"));
  }
  let quizzesQuery;

  if (user.role === "student") {
    quizzesQuery = await Quiz.find().populate({
      path: "questions",
      select: "questionText type options",
    });
  } else if (user.role === "teacher") {
    quizzesQuery = await Quiz.find({ createdBy: user._id }).populate({
      path: "questions",
      select: "questionText type options correctAnswer",
    });
  } else if (user.role === "admin") {
    quizzesQuery = await Quiz.find().populate([
      { path: "questions", select: "questionText type options correctAnswer" },
      { path: "createdBy", select: "name email" },
    ]);
  } else {
    return next(new ApiError(402, "Bu İşlemi Gerçekleştirme Yetkiniz Yok"));
  }

  const quizzes = await quizzesQuery.sort({ createdAt: -1 });
  if (!quizzes || quizzes.length === 0) {
    return next(new ApiError(404, "Quiz bulunamadı"));
  }
  res.status(200).json(new ApiResponse(200, "Quizler Listelendi", quizzes));
});

// Quiz Oluşturma
const createQuiz = asyncHandler(async (req, res, next) => {
  const { title, duration, category, questions } = req.body;
  const user = req.user;

  // Teacher veya admin rol kontrolü
  if (!["teacher", "admin"].includes(user.role)) {
    return next(new ApiError(403, "Bu işlemi gerçekleştirme yetkiniz yok"));
  }

  const quiz = new Quiz({
    title,
    duration,
    category,
    questions,
    createdBy: user._id,
  });
  await quiz.save();
  res.status(201).json(new ApiResponse(201, "Quiz Oluşturuldu", quiz));
});

// Quiz Güncelleme
const updateQuiz = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  const { title, duration, category, questions } = req.body;

  const updateData = {};
  if (title) updateData.title = title;
  if (duration) updateData.duration = duration;
  if (category) updateData.category = category;
  if (questions) updateData.questions = questions;

  const quiz = await Quiz.findById(id);
  if (!quiz) return next(new ApiError(404, "Quiz bulunamadı"));
  // Sadece quiz sahibi teacher veya admin güncelleyebilir
  if (user.role === "teacher" && !quiz.createdBy.equals(user._id)) {
    return next(new ApiError(403, "Bu quiz'i güncelleme yetkiniz yok"));
  }

  const updateQuiz = await Quiz.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  res.staus(200).json(new ApiResponse(200, "Quiz Güncellendi", updateQuiz));
});
// Quiz Silme İşlemi
