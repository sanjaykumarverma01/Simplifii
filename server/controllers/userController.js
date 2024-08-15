const User = require("../models/userModel");
const { generateOtp } = require("../utils/generateOtp");
const { sendOtpEmail } = require("../utils/emailOtp");
const Otp = require("../models/otpModel");

const emailOtp = async (req, res) => {
  const { title, name, countryCode, mobileNo, email } = req.body;

  if (!name || !email || !title || !countryCode || !mobileNo) {
    return res.status(400).json({ message: "Please Enter all the Fields" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }

  const otp = generateOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  try {
    const data = await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt },
      { upsert: true, new: true } // Create if not exists and return the updated document
    );
    await sendOtpEmail(email, data?.otp, title, name);
    res.status(201).json({ message: "OTP sent to your email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyOtpRegisterUser = async (req, res) => {
  const { title, name, countryCode, mobileNo, email, otp } = req.body;

  if (!name || !email || !title || !countryCode || !mobileNo || !otp) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }
  try {
    const otpRecord = await Otp.findOne({ email }).exec();

    if (!otpRecord) {
      return res.status(400).json({ message: "OTP not found." });
    }
    if (otpRecord.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP." });
    }
    if (Date.now() > otpRecord.expiresAt) {
      return res.status(400).json({ message: "OTP expired." });
    }
    const user = new User({ title, name, countryCode, mobileNo, email });
    await user.save();
    await Otp.deleteOne({ email }).exec();
    res
      .status(201)
      .json({ message: "OTP verified and Registration successful." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Registration failed. Please try again later." });
  }
};

module.exports = { emailOtp, verifyOtpRegisterUser };
