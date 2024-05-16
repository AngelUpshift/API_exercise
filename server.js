require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const indexRoutes = require("./routes/index");
const PORT = process.env.PORT || 3001;
const errorMiddleware = require("./middleware/errorMiddleware");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api", indexRoutes);

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
