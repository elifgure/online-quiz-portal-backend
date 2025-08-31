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
router.get("/my-results", authenticate, getMyResults); // Kendi sonuçlarını listele
router.get("/my-results/:id", authenticate, getResultById); // Belirli bir sonucu görüntüle

// Öğretmen route'ları
router.get("/my-quiz-results", authenticate, authorize("teacher"), getMyQuizResults); // Kendi quizlerinin sonuçları
router.get("/teacher/:id", authenticate, authorize("teacher"), getResultForTeacher); // Belirli bir sonucu detaylı görüntüle

// Admin route'ları
router.get("/", authenticate, authorize("admin"), getAllResults); // Tüm sonuçları görüntüle

module.exports = router;