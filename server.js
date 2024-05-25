require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const indexRoutes = require("./routes/index");
const PORT = process.env.PORT || 3001;
const errorMiddleware = require("./middleware/errorMiddleware");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean"); // da ne moze HTML da se pusti vo request

const app = express();
app.use(helmet());

const limiter = rateLimit({
  max: 6,
  windowMs: 3600000,
  message:
    "You made to many requests with this IP adress, wait 1 hour to try again!",
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(xss());

app.use("/api", limiter, indexRoutes);

app.get("/", (req, res) => {
  res.send("Hello NODE API");
});

app.use(errorMiddleware);

try {
  mongoose.connect(process.env.MONGO_URL);
  console.log("MongoDB connected!");
  app.listen(PORT, () => {
    console.log(`Node js is running on port ${PORT}`);
  });
} catch (error) {
  console.log(error);
}
