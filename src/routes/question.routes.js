const express = require("express");
const {
  createQuestion,
  updateQuestion,
} = require("../controllers/question.controller");
const { authenticate, authorize } = require("../middlewares/auth");
const { questionValidators } = require("../validators/question.validators");
const validate = require("../middlewares/validate");

const router = express.Router();

/**
 * @swagger
 * /api/questions:
 *   post:
 *     summary: Yeni bir soru oluştur
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - text
 *               - options
 *               - correctOption
 *               - difficulty
 *               - category
 *             properties:
 *               text:
 *                 type: string
 *                 description: Soru metni
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Şıklar
 *               correctOption:
 *                 type: number
 *                 description: Doğru cevabın indeksi
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *                 description: Zorluk seviyesi
 *               category:
 *                 type: string
 *                 description: Soru kategorisi
 *     responses:
 *       201:
 *         description: Soru başarıyla oluşturuldu
 *       400:
 *         description: Geçersiz girdi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Yetkisiz erişim
 * 
 * /api/questions/{id}:
 *   put:
 *     summary: Mevcut bir soruyu güncelle
 *     tags: [Questions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Soru ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               correctOption:
 *                 type: number
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Soru başarıyla güncellendi
 *       400:
 *         description: Geçersiz girdi
 *       401:
 *         description: Yetkilendirme hatası
 *       403:
 *         description: Yetkisiz erişim
 *       404:
 *         description: Soru bulunamadı
 */

//   Routes
router.post("/", authenticate, authorize("teacher", "admin"), questionValidators, validate, createQuestion);
router.put("/:id", authenticate, authorize("teacher", "admin"), questionValidators, validate, updateQuestion);

module.exports = router;
