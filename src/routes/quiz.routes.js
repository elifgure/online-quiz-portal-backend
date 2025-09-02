const express = require("express");
const {
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
} = require("../controllers/quiz.controller");
const { authenticate, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { quizValidators } = require("../validators/quiz.validators");

const router = express.Router();

/**
 * @swagger
 * /api/quizzes:
 *   get:
 *     summary: Tüm quizleri getir
 *     tags: [Quizzes]
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
 *                 $ref: '#/components/schemas/Quiz'
 *       401:
 *         description: Yetkilendirme hatası
 * 
 *   post:
 *     summary: Yeni quiz oluştur
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - duration
 *               - passingScore
 *             properties:
 *               title:
 *                 type: string
 *                 description: Quiz başlığı
 *               description:
 *                 type: string
 *                 description: Quiz açıklaması
 *               duration:
 *                 type: number
 *                 description: Quiz süresi (dakika)
 *               passingScore:
 *                 type: number
 *                 description: Geçme notu
 *     responses:
 *       201:
 *         description: Quiz başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz girdi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Yetkisiz erişim
 * 
 * /api/quizzes/{id}:
 *   put:
 *     summary: Quiz güncelle
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               duration:
 *                 type: number
 *               passingScore:
 *                 type: number
 *     responses:
 *       200:
 *         description: Quiz başarıyla güncellendi
 *       400:
 *         description: Geçersiz girdi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Yetkisiz erişim
 *       404:
 *         description: Quiz bulunamadı
 * 
 *   delete:
 *     summary: Quiz sil
 *     tags: [Quizzes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Quiz ID
 *     responses:
 *       200:
 *         description: Quiz başarıyla silindi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Yetkisiz erişim
 *       404:
 *         description: Quiz bulunamadı
 */

// Routes
router.get("/", authenticate, getQuizzes);
router.post(
  "/",
  authenticate,
  authorize("teacher", "admin"),
  quizValidators,
  validate,
  createQuiz
);
router.put(
  "/:id",
  authenticate,
  authorize("teacher", "admin"),
  quizValidators,
  validate,
  updateQuiz
);
router.delete("/:id", authenticate, authorize("teacher", "admin"), deleteQuiz);

module.exports = router;