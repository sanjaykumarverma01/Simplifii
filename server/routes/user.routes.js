const express = require("express");
const {
  emailOtp,
  verifyOtpRegisterUser,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").post(emailOtp);
router.post("/verify-otp", verifyOtpRegisterUser);

module.exports = router;
