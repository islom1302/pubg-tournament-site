class User {
  constructor(id, username, email, password, pubgUid, discord) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password = password;
    this.pubgUid = pubgUid;
    this.discord = discord;
    this.role = "player";
  }
}

module.exports = User;