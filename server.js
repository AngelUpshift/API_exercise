require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const indexRoutes = require("./routes/index");
const PORT = process.env.PORT || 3000;
const errorMiddleware = require("./middleware/errorMiddleware");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", indexRoutes);

app.get("/", (req, res) => {
  res.send("Hello NODE API");
});

app.use(errorMiddleware);

try {
  mongoose.connect(
    "mongodb+srv://angel:strongsymbols123@cluster0.dt43urv.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster0"
  );
  console.log("MongoDB connected!");
  app.listen(PORT, () => {
    console.log(`Node js is running on port ${PORT}`);
  });
} catch (error) {
  console.log(error);
}
