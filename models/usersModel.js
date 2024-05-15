const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { isEmail } = require("validator");

const usersSchema = mongoose.Schema(
  {
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
      validate: [isEmail, "please enter valid email"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minlength: 8,
    },
  },
  {
    timestamps: true,
  }
);

usersSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

usersSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
    return ret;
  },
});

module.exports = mongoose.model("Users", usersSchema);
