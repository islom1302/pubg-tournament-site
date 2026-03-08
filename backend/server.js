const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const tournamentRoutes = require("./routes/tournament");
const userRoutes = require("./routes/users");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "PUBG Tournament API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});