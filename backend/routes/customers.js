const express = require("express");
const CustomerController = require("../controllers/customers");

const extractFile = require('../middleware/file');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.post('/signup', CustomerController.createCustomer);

router.post('/login', CustomerController.customerLogin );

router.get("/info", checkAuth, extractFile, CustomerController.getInfoCustomer);

router.get("/:id", checkAuth, extractFile, CustomerController.getInfoCustomerFromManager);

router.put('/info/edit', checkAuth, extractFile, CustomerController.updateInfo);
module.exports = router;
