const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    title: { type: "String", require: true },
    name: { type: "String", require: true },
    countryCode: { type: "String", require: true },
    mobileNo: { type: "number", required: true },
    email: { type: "String", unique: true, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);

module.exports = User;
