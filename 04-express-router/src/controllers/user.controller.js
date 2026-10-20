const users = [
  { id: 1, name: "Sumit" },
  { id: 2, name: "Rahul" },
];

function getAllUsers(req, res) {
  res.status(200).json(users);
}

function getUserById(req, res) {
  const id = Number(req.params.id);

  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  res.status(200).json(user);
}

function createUser() {
  const { name } = req.body;

  const newUser = {
    id: users.length + 1,
    name,
  };
  users.push(newUser);

  res.status(201).json(newUser);
}

function updateUser() {
  const id = Number(req.params.id);

  const user = users.find((user) => user.id == id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (req.body.name) {
    user.name = req.body.name;
  }

  res.status(200).json(user);
}

function deleteUser() {
  const id = Number(req.params.id);

  const index = users.findIndex((user) => user.id === id);

  if (index === -1) {
    return res.status(404).json({
      message: "User not found",
    });
  }
  users.splice(index, 1);

  res.status(200).json({
    message: "User Deleted",
  });
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
