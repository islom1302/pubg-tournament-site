class Tournament {
  constructor(id, name, mode, prize, date, maxPlayers) {
    this.id = id;
    this.name = name;
    this.mode = mode;
    this.prize = prize;
    this.date = date;
    this.maxPlayers = maxPlayers;
    this.players = [];
    this.pendingApprovals = [];
    this.matches = [];
    this.roomId = "";
    this.roomPassword = "";
    this.status = "Waiting";
  }
}

function getDefaultMaxPlayers(mode) {
  const value = String(mode || "").toLowerCase();

  if (value === "solo") return 20;
  if (value === "duo") return 20;
  if (value === "squad") return 20;

  return 20;
}

const tournaments = [
  new Tournament(1, "Solo Clash", "Solo", "500 UC", "2026-03-18", 20),
  new Tournament(2, "Duo Rush", "Duo", "1000 UC", "2026-03-20", 20),
  new Tournament(3, "Squad Arena", "Squad", "2000 UC", "2026-03-23", 20),
];

const getTournaments = (req, res) => {
  res.json(tournaments);
};

const createTournament = (req, res) => {
  const { name, mode, prize, date, maxPlayers } = req.body;

  if (!name || !mode || !prize || !date) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const parsedMaxPlayers = Number(maxPlayers) || getDefaultMaxPlayers(mode);

  const newTournament = new Tournament(
    Date.now(),
    name,
    mode,
    prize,
    date,
    parsedMaxPlayers
  );

  tournaments.push(newTournament);

  res.status(201).json({
    message: "Tournament created successfully",
    tournament: newTournament,
  });
};

const deleteTournament = (req, res) => {
  const { id } = req.params;

  const index = tournaments.findIndex((t) => t.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ message: "Tournament not found" });
  }

  tournaments.splice(index, 1);

  res.json({ message: "Tournament deleted successfully" });
};

const joinTournament = (req, res) => {
  const { tournamentId, playerName, pubgUid, discord } = req.body;

  const tournament = tournaments.find((t) => t.id === Number(tournamentId));

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

  res.json({
    message: "Request sent to admin for approval",
    tournament,
  });
};

const approvePlayer = (req, res) => {
  const { tournamentId, requestId } = req.body;

  const tournament = tournaments.find((t) => t.id === Number(tournamentId));

  if (!tournament) {
    return res.status(404).json({ message: "Tournament not found" });
  }

  if (tournament.players.length >= tournament.maxPlayers) {
    return res.status(400).json({
      message: "Tournament is already full",
    });
  }

  const requestIndex = tournament.pendingApprovals.findIndex(
    (r) => r.id === Number(requestId)
  );

  if (requestIndex === -1) {
    return res.status(404).json({ message: "Request not found" });
  }

  const approvedPlayer = tournament.pendingApprovals.splice(requestIndex, 1)[0];
  approvedPlayer.approved = true;
  tournament.players.push(approvedPlayer);

  res.json({
    message: "Player approved successfully",
    tournament,
  });
};

const declinePlayer = (req, res) => {
  const { tournamentId, requestId } = req.body;

  const tournament = tournaments.find((t) => t.id === Number(tournamentId));

  if (!tournament) {
    return res.status(404).json({ message: "Tournament not found" });
  }

  const requestIndex = tournament.pendingApprovals.findIndex(
    (r) => r.id === Number(requestId)
  );

  if (requestIndex === -1) {
    return res.status(404).json({ message: "Request not found" });
  }

  tournament.pendingApprovals.splice(requestIndex, 1);

  res.json({
    message: "Player request declined",
    tournament,
  });
};

const updateCustomRoom = (req, res) => {
  const { id } = req.params;
  const { roomId, roomPassword, status } = req.body;

  const tournament = tournaments.find((t) => t.id === Number(id));

  if (!tournament) {
    return res.status(404).json({ message: "Tournament not found" });
  }

  tournament.roomId = roomId || "";
  tournament.roomPassword = roomPassword || "";
  tournament.status = status || "Waiting";

  res.json({
    message: "Custom room updated successfully",
    tournament,
  });
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