const express = require("express");

const CityController = require('../controllers/cities');
const router = express.Router();


//lấy danh sách category
router.get("", CityController.getAllCity);

router.get("/:id", CityController.getOneCity);


module.exports = router;
