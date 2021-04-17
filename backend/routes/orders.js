const express = require("express");

const OrderController = require('../controllers/orders');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

//create 1 item cart
router.post("", checkAuth, OrderController.createOrder);

//update
router.put("/:id", checkAuth, OrderController.updateOrder);

router.put("/:id/isSuccess", checkAuth, OrderController.updateIsSuccessOrder);

//lấy danh sách cart theo id Customer (client)
router.get("", checkAuth, OrderController.getAllOrder);
router.get("/manager", checkAuth, OrderController.getOrderOfCreator);

router.get("/:id", checkAuth, OrderController.getOneOrder);

// router.get("/count", checkAuth, OrderController.getCountOrderOfCustomer);

router.get("/order", checkAuth, OrderController.getOrderOfCustomer);



// //lấy danh sách Order theo mảng id cart
// router.get("/pay/:id", checkAuth, OrderController.getOrderToPay);

router.delete("/list/:id", checkAuth, OrderController.deleteOrder);


module.exports = router;
