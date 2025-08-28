const express = require("express");
const {
  createQuestion,
  updateQuestion,
} = require("../controllers/question.controller");
const { authenticate, authorize } = require("../middlewares/auth");
const { questionValidators } = require("../validators/question.validators");
const validate = require("../middlewares/validate");

const router = express.Router();

//   Routes
router.post("/", authenticate, authorize("teacher", "admin"), questionValidators, validate, createQuestion);
router.put("/:id", authenticate, authorize("teacher", "admin"), questionValidators, validate, updateQuestion);

module.exports = router;
