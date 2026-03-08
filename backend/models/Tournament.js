class Tournament {
  constructor(id, name, mode, prize, date) {
    this.id = id;
    this.name = name;
    this.mode = mode;
    this.prize = prize;
    this.date = date;
    this.players = [];
    this.pendingApprovals = [];
  }
}

module.exports = Tournament;