const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL,
      pass: process.env.PASSWORD,
    },
  });
};

const createMailGenerator = () => {
  return new Mailgen({
    theme: "default",
    product: {
      name: "OTP Verification",
      link: "https://mailgen.js/",
    },
  });
};

const sendOtpEmail = async (email, otp, title, name) => {
  const transporter = createTransporter();
  const mailGenerator = createMailGenerator();

  const emailBody = {
    body: {
      name: `${title}. ${name} `,
      intro: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
      outro: "Thank you for choosing us",
    },
  };

  const mail = mailGenerator.generate(emailBody);

  const mailOptions = {
    from: process.env.GMAIL,
    to: email,
    subject: "OTP Code",
    html: mail,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
    throw new Error("Failed to send OTP email");
  }
};

module.exports = { sendOtpEmail };
