const express = require("express");
const {
   createResult,
  getMyResults,
  getMyQuizResults,
  getResultById,
  getResultForTeacher,
  getAllResults,
} = require("../controllers/result.controller");

const { authenticate, authorize } = require("../middlewares/auth");


const router = express.Router();

// Öğrenci route'ları
router.post("/submit", authenticate, createResult); // Quiz sonucu gönder
router.get("/my", authenticate, authorize("student"), getMyResults)
router.get("/my/:quizId", authenticate, authorize("student"), getResultById)
router.get("/my-results/:resultId", authenticate, getMyResultDetail); // Sonuç detayı

// Öğretmen route'ları
router.get("/my-quizzes", authenticate, authorize("teacher"), getMyQuizResults)
router.get("/quiz/:quizId", authenticate, authorize("teacher"), getResultForTeacher ); // Quiz sonuçlarını görüntüle

// Admin route'ları
router.get("/", authenticate, authorize("admin"), getAllResults); // Tüm sonuçları görüntüle

module.exports = router;
