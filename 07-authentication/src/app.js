const express = require("express");
const cookieParse = require("cookie-parser");

const authRouter = require("./routes/auth.routes");
const userRoute = require("./routes/user.routes");

const app = express();

app.use(express.json());
app.use(cookieParse());

app.use("/api/auth", authRouter);
app.use("/api/users", userRoute);

app.get("/", (req, res) => {
  res.json({
    message: "Authentication API is running",
  });
});

app.use((err, req, res, next) => {
  console.error("Error : ", err);

  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
});

module.exports = app;
