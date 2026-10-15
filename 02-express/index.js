const express = require("express");

const app = express();

const PORT = 3000;

app.use(express.json());

let users = [
  {
    id: 1,
    name: "Sumit",
  },
  {
    id: 2,
    name: "Rahul",
  },
];

function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

app.use(logger);

function validateUser(req, res, next) {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      message: "Name and email are required",
    });
  }

  next();
}

app.get("/", (req, res) => {
  res.status(200).json(users);
});

app.get("/users", (req, res) => {
  console.log(req.headers);
  res.set("X-App-Name", "Student API");

  res.json({ users });
});

app.get("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.filter((user) => user.id === id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json(user);
});

app.post("/users", validateUser, (req, res) => {
  console.log("users:", users);
  const { name } = req.body;
  const length = users.length;

  const newUser = {
    id: length,
    name,
  };
  users.push(newUser);

  res.status(201).json({ message: "User created", users: users });
});

app.patch("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (req.body.name) {
    user.name = req.body.name;
  }

  res.status(200).json(user);
});

// app.put("/users/:id", (req, res) => {
//   const id = parseInt(req.params.id);
//   const updatedUser = req.body;
// });

app.delete("/users/:id", (req, res) => {
  const id = Number(req.params.id);

  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  users.splice(userIndex, 1);

  res.status(200).json({
    message: "User deleted",
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

app.get("/check/:id", (req, res, next) => {
  try {
    throw new Error("Database failed");
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
