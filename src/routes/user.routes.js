const express = require("express");
const {
  getProfile,
  getAllUsers,
  updateRole,
} = require("../controllers/user.controller");
const { authanticate, authorize } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { updateRoleValidators } = require("../validators/user.validators");

const router = express.Router();

router.get("/profile", authanticate, getProfile);
router.get("/", authanticate, authorize("admin"), getAllUsers);
router.patch(
  "/:id",
  authanticate,
  authorize("admin"),
  updateRoleValidators,
  validate,
  updateRole
);

module.exports = router;
