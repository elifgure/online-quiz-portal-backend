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