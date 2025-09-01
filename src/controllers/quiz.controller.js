const Quiz = require("../models/Quizzes");
const Question = require("../models/Questions");
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

  let query;

  if (user.role === "student") {
    query = Quiz.find().populate({
      path: "questions",
      select: "questionText type options",
    });
  } else if (user.role === "teacher") {
    query = Quiz.find({ createdBy: user._id }).populate({
      path: "questions",
      select: "questionText type options correctAnswer",
    });
  } else if (user.role === "admin") {
    query = Quiz.find().populate([
      { path: "questions", select: "questionText type options correctAnswer" },
      { path: "createdBy", select: "name email" },
    ]);
  } else {
    return next(new ApiError(402, "Bu İşlemi Gerçekleştirme Yetkiniz Yok"));
  }

  // Sort işlemi ve query'i çalıştır
  const quizzes = await query.sort({ createdAt: -1 });

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

  // Önce quiz'i oluştur
  const quiz = new Quiz({
    title,
    duration,
    category,
    createdBy: user._id,
  });
  await quiz.save();

  // Sorulara quiz ID'sini ekle
  const questionsWithQuiz = questions.map(q => ({
    ...q,
    quiz: quiz._id
  }));

  // Soruları kaydet
  const savedQuestions = await Question.insertMany(questionsWithQuiz);

  // Quiz'e soru ID'lerini ekle
  quiz.questions = savedQuestions.map(q => q._id);
  await quiz.save();
  res.status(201).json(new ApiResponse(201, "Quiz Oluşturuldu", quiz));
});

// Quiz Güncelleme
const updateQuiz = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = req.user;
  const { title, duration, category, questions } = req.body;

  // Quiz'i bul ve yetki kontrolü yap
  const quiz = await Quiz.findById(id);
  if (!quiz) return next(new ApiError(404, "Quiz bulunamadı"));
  
  // Sadece quiz sahibi teacher veya admin güncelleyebilir
  if (user.role === "teacher" && !quiz.createdBy.equals(user._id)) {
    return next(new ApiError(403, "Bu quiz'i güncelleme yetkiniz yok"));
  }

  // Temel bilgileri güncelle
  if (title) quiz.title = title;
  if (duration) quiz.duration = duration;
  if (category) quiz.category = category;

  // Soru işlemleri varsa
  if (questions && Array.isArray(questions)) {
    // Mevcut soruları tut
    let currentQuestions = [...quiz.questions];

    for (const question of questions) {
      const { operation, _id, ...questionData } = question;

      switch (operation) {
        case 'update':
          if (_id) {
            // Mevcut soruyu güncelle
            await Question.findByIdAndUpdate(_id, {
              ...questionData,
              quiz: quiz._id
            });
          }
          break;

        case 'delete':
          if (_id) {
            // Soruyu sil
            await Question.findByIdAndDelete(_id);
            currentQuestions = currentQuestions.filter(qId => !qId.equals(_id));
          }
          break;

        case 'add':
          // Yeni soru ekle
          const newQuestion = await Question.create({
            ...questionData,
            quiz: quiz._id
          });
          currentQuestions.push(newQuestion._id);
          break;
      }
    }

    // Quiz'in soru listesini güncelle
    quiz.questions = currentQuestions;
  }

  // Quiz'i kaydet
  await quiz.save();

  // Güncel quiz'i döndür
  const updatedQuiz = await Quiz.findById(id)
    .populate('questions')
    .populate('createdBy', 'name email');

  res.status(200).json(new ApiResponse(200, "Quiz Güncellendi", updatedQuiz));
});
// Quiz Silme İşlemi
const deleteQuiz= asyncHandler(async (req, res, next)=>{
  const {id} = req.params
   const user = req.user;

  const quiz = await Quiz.findById(id)
  if(!quiz) return next(new ApiError(404, "Quiz Bulunamadı"))

    if(user.role === "teacher" && !quiz.createdBy.equals(user._id)){
       return next(new ApiError(403, "Bu quiz'i silme yetkiniz yok"));
    }
  await Quiz.findOneAndDelete({ _id: id });
   res
    .status(200)
    .json(new ApiResponse(200, "Quiz ve ilişkili sorular başarıyla silindi"));
})

module.exports = {
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz
}