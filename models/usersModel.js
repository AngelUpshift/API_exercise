const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const usersSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    maxlength: 25,
  },
  lastname: {
    type: String,
    required: [true, "lastname is required"],
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: [true, "email is taken"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
    minlength: 8,
  },
});

usersSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Users", usersSchema);
