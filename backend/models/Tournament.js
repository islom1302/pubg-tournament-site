const mongoose = require("mongoose");

const tournamentSchema = new mongoose.Schema({
  name: String,
  mode: String,
  prize: String,
  date: String,
  maxPlayers: Number,
  players: {
    type: Array,
    default: []
  },
  pendingApprovals: {
    type: Array,
    default: []
  },
  matches: {
    type: Array,
    default: []
  },
  roomId: {
    type: String,
    default: ""
  },
  roomPassword: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    default: "Waiting"
  }
});

module.exports = mongoose.model("Tournament", tournamentSchema);
    type: String,
    default: "Waiting"
  }
});


module.exports = mongoose.model("Tournament", tournamentSchema);
