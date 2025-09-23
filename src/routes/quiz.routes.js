const express = require("express");
const {
  getQuizzes,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  startQuiz,
  getQuizForStudent
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
 *               - duration
 *               - category
 *               - questions
 *             properties:
 *               title:
 *                 type: string
 *                 description: Quiz başlığı
 *               duration:
 *                 type: number
 *                 description: Quiz süresi (dakika)
 *               category:
 *                 type: string
 *                 description: Quiz kategorisi
 *               questions:
 *                 type: array
 *                 description: Quiz soruları
 *                 items:
 *                   type: object
 *                   required:
 *                     - type
 *                     - questionText
 *                     - options
 *                     - correctAnswer
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [multiple-choice, true-false, text]
 *                       description: Soru tipi
 *                     questionText:
 *                       type: string
 *                       description: Soru metni
 *                     options:
 *                       type: array
 *                       description: Çoktan seçmeli sorular için şıklar
 *                       items:
 *                         type: object
 *                         required:
 *                           - text
 *                           - isCorrect
 *                         properties:
 *                           text:
 *                             type: string
 *                             description: Şık metni
 *                           isCorrect:
 *                             type: boolean
 *                             description: Doğru cevap mı?
 *                     correctAnswer:
 *                       type: object
 *                       description: Soru tipine göre doğru cevap
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
 *   get:
 *     summary: Quiz düzenleme verilerini getir (edit için)
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
 *         description: Quiz düzenleme verileri başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 category:
 *                   type: string
 *                 duration:
 *                   type: number
 *                 questions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       questionText:
 *                         type: string
 *                       type:
 *                         type: string
 *                       options:
 *                         type: array
 *                         items:
 *                           type: string
 *                       correctAnswer:
 *                         oneOf:
 *                           - type: array
 *                             items:
 *                               type: string
 *                           - type: boolean
 *                           - type: string
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
 *               category:
 *                 type: string
 *               duration:
 *                 type: number
 *               questions:
 *                 type: array
 *                 description: Quiz soruları
 *                 items:
 *                   type: object
 *                   required:
 *                     - type
 *                     - questionText
 *                     - correctAnswer
 *                   properties:
 *                     operation:
 *                       type: string
 *                       enum: [add, update, delete]
 *                       description: Soru işlemi
 *                     _id:
 *                       type: string
 *                       description: Mevcut soru ID (update/delete için)
 *                     type:
 *                       type: string
 *                       enum: [multiple-choice, true-false, text]
 *                     questionText:
 *                       type: string
 *                     options:
 *                       type: array
 *                       items:
 *                         type: string
 *                     correctAnswer:
 *                       oneOf:
 *                         - type: array
 *                           items:
 *                             type: string
 *                         - type: boolean
 *                         - type: string
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
router.get("/:id", authenticate, authorize("teacher", "admin"), updateQuiz);
router.put(
  "/:id",
  authenticate,
  authorize("teacher", "admin"),
  quizValidators,
  validate,
  updateQuiz
);
router.delete("/:id", authenticate, authorize("teacher", "admin"), deleteQuiz);


/**
 * @swagger
 * /api/quizzes/{id}/start:
 *   post:
 *     summary: Quiz başlat (Öğrenci için) - Quiz detayları ve session bilgisi
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
 *         description: Quiz başarıyla başlatıldı
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Quiz başlatıldı"
 *                 data:
 *                   type: object
 *                   properties:
 *                     quiz:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         duration:
 *                           type: integer
 *                         category:
 *                           type: string
 *                         questions:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                               questionText:
 *                                 type: string
 *                               type:
 *                                 type: string
 *                               options:
 *                                 type: array
 *                                 items:
 *                                   type: object
 *                     session:
 *                       type: object
 *                       properties:
 *                         quizId:
 *                           type: string
 *                         startTime:
 *                           type: string
 *                           format: date-time
 *                         duration:
 *                           type: integer
 *                         endTime:
 *                           type: string
 *                           format: date-time
 *                     instructions:
 *                       type: object
 *                       properties:
 *                         totalQuestions:
 *                           type: integer
 *                         duration:
 *                           type: string
 *                         submitEndpoint:
 *                           type: string
 *                         submitFormat:
 *                           type: object
 *       400:
 *         description: Bu quiz'i daha önce çözdünüz
 *       403:
 *         description: Sadece öğrenciler erişebilir
 *       404:
 *         description: Quiz bulunamadı
 */
router.post("/:id/start", authenticate, authorize("student"), startQuiz);



module.exports = router;