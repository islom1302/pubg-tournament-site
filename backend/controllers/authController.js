const users = [];

const signup = (req, res) => {
  const { username, email, password, pubgUid, discord } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      message: "Username, email, and password are required",
    });
  }

  const existingUser = users.find((user) => user.email === email);

  if (existingUser) {
    return res.status(400).json({
      message: "User already exists",
    });
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password,
    pubgUid: pubgUid || "",
    discord: discord || "",
    role: "player",
  };

  users.push(newUser);

  res.status(201).json({
    message: "Signup successful",
    user: newUser,
  });
};

const login = (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  res.json({
    message: "Login successful",
    user,
  });
};

const getAllUsers = () => users;

module.exports = {
  signup,
  login,
  getAllUsers,
};