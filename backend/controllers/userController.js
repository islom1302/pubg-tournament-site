const { getAllUsers } = require("./authController");

const getUsers = (req, res) => {
  res.json(getAllUsers());
};

module.exports = {
  getUsers,
};