const { createToken } = require("../JWT");
const User = require("../models/usersModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sendEmail = require("../utils/email");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// register
const postUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userWithId = await User.findByIdAndUpdate(id, req.body);

    if (!userWithId) {
      res.status(404).json(`User with ${id} is not found!`);
    }

    const updatedUser = await User.findById(id);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToDelete = await User.findByIdAndDelete(id);

    if (!userToDelete) {
      res.status(404).json(`user with ${id} does not exist!`);
    }

    res.status(200).json(userToDelete);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// login
const loginUser = async (req, res) => {
  try {
    // prvo da proveram dali e tocen mail i pass
    const { email, password } = req.body;
    const user = await User.findOne({ email: { $eq: email } });

    if (!user) {
      res.json({ message: "Wrong email adress" });
    } else {
      const crypt = await bcrypt.compare(password, user.password);
      if (!crypt) {
        res
          .status(400)
          .json({ message: "Combination of email and password doesn't exist" });
      } else {
        const accessToken = createToken(user);

        res.cookie("access-token-cookie", accessToken, {
          maxAge: 2000000,
          httpOnly: true,
        });

        res.status(200).json("LOGGED IN");
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  //1. get user based on posted email
  const { email } = req.body;
  const user = await User.findOne({ email: { $eq: email } });

  if (!user) {
    return res.status(404).json({ message: "Cannot find the email adress" });
  }

  //2. generate a random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  //3. send the token back to the user email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/users/resetPassword/${resetToken}`;
  // req.protocol e zamena za http ili https
  // req.get('host') e zamena za localhost
  const message = `We have received a password reset request. Please use the link below to reset your password\n\n${resetUrl}`;

  try {
    sendEmail({
      email: user.email,
      subject: "Password reseting",
      message: message,
    });
    res.status(200).json({ message: "Email sent!" });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ message: "Token expired or not found!" });
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  user.passwordChangedAt = Date.now();

  await user.save();

  const loginToken = createToken(user);

  res.cookie("access-token-cookie", loginToken, {
    maxAge: 2000000,
    httpOnly: true,
  });

  res.status(200).json({ message: "LOGGED IN" });
};

module.exports = {
  getUsers,
  postUser,
  updateUser,
  deleteUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
