const express = require("express");
const router = express.Router();
const {
  getUsers,
  postUser,
  updateUser,
  deleteUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require("../controllers/usersController");
const { validateToken } = require("../JWT");
// const restrict = require("../middleware/authMiddleware");

router.get("/", validateToken, getUsers);

router.post("/register", postUser);

router.post("/login", loginUser);

router.post("/forgot-password", validateToken, forgotPassword);

router.patch("/resetPassword/:token", resetPassword);

router.put("/:id", updateUser);

router.delete("/:id", validateToken, deleteUser); /// RESTRICT MORA DA GO SREDAM UNDEFINED E!!!

module.exports = router;
