const express = require("express");
const router = express.Router();
const {
  getUsers,
  postUser,
  updateUser,
  deleteUser,
  loginUser,
} = require("../controllers/usersController");
const { validateToken } = require("../JWT");

router.get("/", validateToken, getUsers);

router.post("/register", postUser);

router.post("/login", loginUser);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

module.exports = router;
