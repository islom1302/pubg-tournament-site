const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const authRoutes = require("./routes/auth");
const tournamentRoutes = require("./routes/tournament");
const userRoutes = require("./routes/users");

const app = express();
const PORT = process.env.PORT || 5000;

/* MongoDB connection */
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "PUBG Tournament API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/tournaments", tournamentRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});