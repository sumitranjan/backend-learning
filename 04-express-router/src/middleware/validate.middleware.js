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

module.exports = validateProduct;
