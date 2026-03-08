const Tournament = require("../models/Tournament");

function getDefaultMaxPlayers(mode) {
  const value = String(mode || "").toLowerCase();

  if (value === "solo") return 20;
  if (value === "duo") return 20;
  if (value === "squad") return 20;

  return 20;
}

const getTournaments = async (req, res) => {
  try {
    const tournaments = await Tournament.find();
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const createTournament = async (req, res) => {
  try {
    const { name, mode, prize, date, maxPlayers } = req.body;

    if (!name || !mode || !prize || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const parsedMaxPlayers = Number(maxPlayers) || getDefaultMaxPlayers(mode);

    const newTournament = await Tournament.create({
      name,
      mode,
      prize,
      date,
      maxPlayers: parsedMaxPlayers,
      players: [],
      pendingApprovals: [],
      matches: [],
      roomId: "",
      roomPassword: "",
      status: "Waiting"
    });

    res.status(201).json({
      message: "Tournament created successfully",
      tournament: newTournament,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteTournament = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTournament = await Tournament.findByIdAndDelete(id);

    if (!deletedTournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    res.json({ message: "Tournament deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const joinTournament = async (req, res) => {
  try {
    const { tournamentId, playerName, pubgUid, discord } = req.body;

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    if (tournament.players.length >= tournament.maxPlayers) {
      return res.status(400).json({
        message: "This tournament is already full",
      });
    }

    const alreadyPending = tournament.pendingApprovals.some(
      (player) => player.pubgUid === pubgUid || player.playerName === playerName
    );

    if (alreadyPending) {
      return res.status(400).json({
        message: "You already have a pending request for this tournament",
      });
    }

    const alreadyApproved = tournament.players.some(
      (player) => player.pubgUid === pubgUid || player.playerName === playerName
    );

    if (alreadyApproved) {
      return res.status(400).json({
        message: "You are already approved for this tournament",
      });
    }

    const request = {
      id: Date.now(),
      playerName,
      pubgUid,
      discord,
      approved: false,
    };

    tournament.pendingApprovals.push(request);
    await tournament.save();

    res.json({
      message: "Request sent to admin for approval",
      tournament,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const approvePlayer = async (req, res) => {
  try {
    const { tournamentId, requestId } = req.body;

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    if (tournament.players.length >= tournament.maxPlayers) {
      return res.status(400).json({
        message: "Tournament is already full",
      });
    }

    const requestIndex = tournament.pendingApprovals.findIndex(
      (r) => String(r.id) === String(requestId)
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: "Request not found" });
    }

    const approvedPlayer = tournament.pendingApprovals.splice(requestIndex, 1)[0];
    approvedPlayer.approved = true;
    tournament.players.push(approvedPlayer);

    await tournament.save();

    res.json({
      message: "Player approved successfully",
      tournament,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const declinePlayer = async (req, res) => {
  try {
    const { tournamentId, requestId } = req.body;

    const tournament = await Tournament.findById(tournamentId);

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    const requestIndex = tournament.pendingApprovals.findIndex(
      (r) => String(r.id) === String(requestId)
    );

    if (requestIndex === -1) {
      return res.status(404).json({ message: "Request not found" });
    }

    tournament.pendingApprovals.splice(requestIndex, 1);

    await tournament.save();

    res.json({
      message: "Player request declined",
      tournament,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateCustomRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomId, roomPassword, status } = req.body;

    const tournament = await Tournament.findById(id);

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" });
    }

    tournament.roomId = roomId || "";
    tournament.roomPassword = roomPassword || "";
    tournament.status = status || "Waiting";

    await tournament.save();

    res.json({
      message: "Custom room updated successfully",
      tournament,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getTournaments,
  createTournament,
  deleteTournament,
  joinTournament,
  approvePlayer,
  declinePlayer,
  updateCustomRoom,
};