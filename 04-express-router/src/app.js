const express = require("express");

const productRouter = require("./routes/product.routes");
const userRouter = require("./routes/user.routes");

const logger = require("./middleware/logger.middleware");

const app = express();

app.use(express.json());

app.use(logger);

app.use("/api/v1/products", productRouter);
app.use("/api/users", userRouter);

module.exports = app;
