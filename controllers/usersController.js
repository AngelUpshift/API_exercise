const { createToken } = require("../JWT");
const User = require("../models/usersModel");
const bcrypt = require("bcrypt");

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

module.exports = {
  getUsers,
  postUser,
  updateUser,
  deleteUser,
  loginUser,
};
