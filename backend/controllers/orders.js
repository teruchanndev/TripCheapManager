const Order = require("../models/order");

exports.createOrder = (req, res, next) => {
  // console.log(req);
  const order = new Order({
    nameTicket: req.body.nameTicket,
    imageTicket: req.body.imageTicket,
    dateStart: req.body.dateStart,
    dateEnd: req.body.dateEnd,
    idTicket: req.body.idTicket,
    idCreator: req.body.idCreator,
    idCustomer: req.body.idCustomer,
    itemService: req.body.itemService,
    payMethod: req.body.payMethod,
    status: req.body.status,
    isCancel: req.body.isCancel
  });
  // console.log(order);
  order.save().then(createdOrder => {
    res.status(201).json({
      message: "Order added successfully",
      ticket: {
        ...createdOrder,
        id: createdOrder._id
      }
    });
  }).catch(error => {
    res.status(500).json({
      message: 'Creating a Order failed!'
    })
  })
}

exports.updateOrder = (req, res, next) => {
  // console.log(req.body.id);
  Order.updateOne({_id: req.body.id},  { $set: { isCancel: req.body.isCancel, status: req.body.status } })
  .then(result => {
    // console.log(result);
    res.status(200).json({ message: "Update successful!" + result });
  }).catch(error => {
    res.status(500).json({
      message: 'Update failed!' + error
    });
  });
}

exports.updateIsSuccessOrder = (req, res, next) => {
  // console.log(req.body.id);
  Order.updateOne({_id: req.body.id},  { $set: { isSuccess: req.body.isSuccess, isConfirm: req.body.isConfirm} })
  .then(result => {
    // console.log(result);
    res.status(200).json({ message: "Update successful!" + result });
  }).catch(error => {
    res.status(500).json({
      message: 'Update failed!' + error
    });
  });
}


function checkCompareDate(date1) {
  const dateCheck = date1.split('/');
  const dateNow = new Date();
  if (dateCheck[2] > dateNow.getFullYear()) { return 1; } else if (dateCheck[2] < dateNow.getFullYear()) { return -1; } else {
    if (dateCheck[1] > dateNow.getMonth() + 1) { return 1; } else if (dateCheck[1] < dateNow.getMonth() + 1) {return -1; } else {
      if (dateCheck[0] > dateNow.getDate()) {return 1; } else if (dateCheck[0] < dateNow.getDate()) { return -1; } else { return 0; }
    }
  }
}

exports.getAllOrder = (req, res, next) => {

  const now = new Date();
  Order.find({idCustomer: req.userData.customerId}).then(documents => {
    // console.log('documents.length: ' + documents.length);
    for(let i = 0; i < documents.length; i++) {
      // var part = documents[i].dateEnd.split('/');
      // var d = new Date(part[2] + '-'+ part[1] + '-' + part[0]);
      var check = checkCompareDate(documents[i].dateEnd);
      // var checkDate = (d < now); //true => đã quá hạn
      // console.log('checkDate: ' + check);
      if(check < 0) {
        // console.log('documents: ' + documents[i]);
        Order.updateOne({_id: documents[i]._id}, { $set:{ status: true } })
        .then(result => {
          // console.log(result);
        }).catch(error => {
          // console.log('error: ' + result);
        });
      }
    } 
  });

  Order.find({idCustomer: req.userData.customerId}).then(documents => {
    res.status(200).json({
      message: "Order fetched successfully!",
      order: documents
    });
  });
}

exports.getOneOrder = (req, res, next) => {
  // console.log(req.params);
  Order.findById(req.params.id).then(order => {
    if (order) {
      // console.log(order);
      res.status(200).json(order);
    } else {
      res.status(404).json({ message: "order not found!" });
    }
  }).catch(error => {
    res.status(500).json({
      message: 'Fetching a order failed!'
    });
  });
}

exports.deleteOrder = (req, res, next) => {
  // console.log(req.params.id);
  arrId = req.params.id.split(',');
  for(let item of arrId) {
    // console.log(item);
    order.deleteOne({ _id: item, idCustomer: req.userData.customerId }).then(
    result => {
      if(result.n > 0) {
        res.status(200).json({ message: "order deleted!" });
      } else {
        res.status(401).json({ message: "Not authorized!" });
      }
    }).catch(error => {
      res.status(500).json({
        message: 'Delete order failed!'
      })
    })
  }
}

exports.getCountOrderOfCustomer = (req, res, next) => {
  // console.log(req.userData);
  Order.countDocuments(
    {idCustomer: req.userData.customerId}).then(
    count => {
      // console.log(count);
      res.status(200).json({
        message: "Count item in Order",
        countOrder: count
      });
    }).catch(error => {
      res.status(500).json({
        message: 'failed!' + error
      })
    })
}

exports.getOrderOfCustomer = (req, res, next) => {
  Order.find(
    {idCustomer: req.userData.customerId}).then(
    document => {
      res.status(200).json({
        message: "Fetching order successfully!",
        order: document
      });
    }).catch(error => {
      res.status(500).json({
        message: 'failed!' + error
      })
    })
}

exports.getOrderOfCreator = (req, res, next) => {
    console.log('req user: ' + req.userData);
    Order.find({idCreator: req.userData.userId}).then(documents => {
      res.status(200).json({
        message: "Order fetched successfully!",
        order: documents
      });
    });
  }

