require("dotenv");
const express = require("express");
const router = express.Router();
const bookRoute = require("../routes/bookRoute");
const userRoute = require("../routes/userRoute");

const defaultRoutes = [
  {
    path: "/books",
    route: bookRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
