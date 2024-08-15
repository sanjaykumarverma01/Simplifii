const crypto = require("crypto");

const generateOtp = () => {
  const otp = crypto.randomInt(100000, 999999).toString(); // 6-digit OTP
  return otp;
};

module.exports = { generateOtp };
