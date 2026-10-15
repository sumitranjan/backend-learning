const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());

// Logger Middleware
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);

  next();
}

app.use(logger);

// Authentication Middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({
      message: "Authentication required",
    });
  }

  req.user = {
    id: 1,
    name: "Sumit",
    role: "admin",
  };

  next();
}

// Authorization Middleware
function isAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access required",
    });
  }

  next();
}

// Validation Middleware
function validateProduct(req, res, next) {
  console.log(req.user);
  console.log(req.body);
  const { name, price } = req.body;

  if (name == null || price == null) {
    return res.status(400).json({
      message: "Name and price are required",
    });
  }

  next();
}

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/products", authenticate, isAdmin, validateProduct, (req, res) => {
  res.status(201).json({
    message: "Product created",
    product: req.body,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`);
});
