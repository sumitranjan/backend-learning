// const express = require("express");
// const userRouter = require("./src/routes/user.routes");

// const app = express();
// const PORT = 3000;

// app.use(express.json());

// app.use("/api/users", userRouter);

// app.listen(PORT, () => {
//   console.log(`Server running on port : ${PORT}`);
// });

const app = require("./src/app");

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
