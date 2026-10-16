const express = require("express");
const userRouter = require("./route/user.router");
const logger = require("./middleware/logger.middleware");

const app = express();

app.use(express.json());
app.use(logger);
app.use("/api/v1/users", userRouter);

module.exports = app;
