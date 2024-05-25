const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
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
    confirmPassword: {
      type: String,
      required: [true, "confirmPassword is required"],
      minlength: 8,
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Password doesn't match!",
      },
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
  },
  {
    timestamps: true,
  }
);

usersSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

usersSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);

    this.confirmPassword = undefined;
    next();
  }
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
