let products = [
  {
    id: 1,
    name: "Laptop",
    price: 50000,
  },
  {
    id: 2,
    name: "Mouse",
    price: 2000,
  },
];

function getProducts(req, res) {
  res.status(200).json(products);
}

function getProductById(req, res) {
  const id = Number(req.params.id);

  const product = products.find((product) => product.id === id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  res.status(200).json(product);
}

function createProduct(req, res) {
  const { name, price } = req.body;

  const product = {
    id: products.length + 1,
    name,
    price,
  };

  products.push(product);

  res.status(201).json(product);
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
};
