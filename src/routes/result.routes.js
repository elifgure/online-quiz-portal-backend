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

/**
 * @swagger
 * /api/results/submit:
 *   post:
 *     summary: Quiz sonucu gönder
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quizId
 *               - answers
 *             properties:
 *               quizId:
 *                 type: string
 *                 description: Quiz ID'si
 *               answers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - questionId
 *                     - answer
 *                   properties:
 *                     questionId:
 *                       type: string
 *                     answer:
 *                       type: string
 *     responses:
 *       201:
 *         description: Sonuç başarıyla kaydedildi
 *       400:
 *         description: Geçersiz girdi
 *       401:
 *         description: Yetkilendirme hatası
 * 
 * /api/results/my-results:
 *   get:
 *     summary: Öğrencinin kendi sonuçlarını listele
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Result'
 *       401:
 *         description: Yetkilendirme hatası
 * 
 * /api/results/my-results/{id}:
 *   get:
 *     summary: Belirli bir sonucu görüntüle (öğrenci)
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sonuç ID
 *     responses:
 *       200:
 *         description: Başarılı
 *       401:
 *         description: Yetkilendirme hatası
 *       404:
 *         description: Sonuç bulunamadı
 * 
 * /api/results/my-quiz-results:
 *   get:
 *     summary: Öğretmenin kendi quizlerinin sonuçlarını listele
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Yetkisiz erişim
 * 
 * /api/results/teacher/{id}:
 *   get:
 *     summary: Belirli bir sonucu detaylı görüntüle (öğretmen)
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sonuç ID
 *     responses:
 *       200:
 *         description: Başarılı
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Yetkisiz erişim
 *       404:
 *         description: Sonuç bulunamadı
 * 
 * /api/results:
 *   get:
 *     summary: Tüm sonuçları görüntüle (admin)
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Başarılı
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Yetkisiz erişim
 */

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