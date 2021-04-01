const express = require("express");


const checkAuth = require('../middleware/check-auth');
const TicketController = require("../controllers/ticket");
const extractFile = require('../middleware/file');

const router = express.Router();



router.post("",
  checkAuth,
  extractFile,
  TicketController.createTicket);

router.put("/:id",
  checkAuth,
  extractFile,
  TicketController.updateTicket);

router.get("", checkAuth, TicketController.getAllTicket);

router.get("/:id", TicketController.getOneTicket);

router.get("/tickets/:creator", TicketController.getTicketOfCreator);

router.delete("/:id", checkAuth, TicketController.deleteOneTicket);

module.exports = router;
