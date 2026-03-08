const express = require("express");
const router = express.Router();
const tournamentController = require("../controllers/tournamentController");

router.get("/", tournamentController.getTournaments);
router.post("/", tournamentController.createTournament);
router.delete("/:id", tournamentController.deleteTournament);
router.post("/join", tournamentController.joinTournament);
router.post("/approve", tournamentController.approvePlayer);
router.post("/decline", tournamentController.declinePlayer);
router.put("/:id/custom-room", tournamentController.updateCustomRoom);

module.exports = router;