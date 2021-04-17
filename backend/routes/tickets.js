const express = require("express");

const extractFile = require('../middleware/file');
const checkAuth = require('../middleware/check-auth');
const TicketController = require("../controllers/ticket");

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

router.get("/all", TicketController.getAll);

// router.get("/detail/:id", TicketController.getOneTicket);
router.get("/city/:city", TicketController.getTicketOfCity);

router.get("/:id", TicketController.getOneTicket);

router.delete("/:id", checkAuth, TicketController.deleteOneTicket);

module.exports = router;
