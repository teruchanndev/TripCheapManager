const express = require("express");
const UserController = require("../controllers/user");

const extractFile = require('../middleware/file');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('/signup', UserController.createUser);

router.post('/login', UserController.userLogin );

router.get("/info", checkAuth, extractFile, UserController.getInfoUser);

router.put('/info/edit', checkAuth, extractFile, UserController.updateInfo);
module.exports = router;
