const express = require("express");
const {
  register,
  login,
  refresh,
  logout,
  forgotPassword,
  resetPassword
} = require("../controllers/auth.controller");
const { authenticate } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const {
  registerValidators,
  loginValidators,
  refreshValidators,
} = require("../validators/auth.validators");

const router = express.Router()

// Routes
router.post('/register', registerValidators, validate, register)

router.post('/login', loginValidators, validate, login)

router.post('/refresh', refreshValidators, validate, refresh)

router.post('/logout', authenticate, logout)

// Şifre sıfırlama routes
router.post('/forgot-password', forgotPassword)
router.post('/reset-password/:token', resetPassword)

module.exports = router;
