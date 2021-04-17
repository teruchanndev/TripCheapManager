const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Customer = require("../models/customer");

exports.createCustomer = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
      .then(hash => {
          const customer = new Customer({
              email: req.body.email,
              username: req.body.username,
              password: hash
          });
          customer.save()
              .then(result => {
                  res.status(201).json({
                      message: 'Customer created!',
                      result: result
                  });
              })
              .catch(err => {
                  res.status(500).json({
                      message: 'Invalid authentication credentials!' + err
                  });
              });
      });
}

exports.customerLogin = (req, res, next) => {
  let fetchCustomer;
  Customer.findOne({email: req.body.email})
      .then(customer => {
          if(!customer) {
              return res.status(401).json({
                  message: 'Auth failed!'
              });
          }
          console.log('customer check: ' + customer);
          fetchCustomer = customer;
        //   console.log(req.body.password + ' and '+ customer.password);
          return bcrypt.compare(req.body.password, customer.password);
      })
      .then(result => {
          console.log('result: ' + result);
          if(!result) {
              return res.status(401).json({
                  message: 'Auth failed!' + result
              });
          }
          const token = jwt.sign(
              {email: fetchCustomer.email, customerId: fetchCustomer._id},
              process.env.JWT_KEY,
              {expiresIn: '1h'}
          );
          console.log('token: ' + token);
          res.status(200).json({
              token: token,
              expiresIn: 3600,
              customerId: fetchCustomer._id,
              username: fetchCustomer.username,
              created_at: fetchCustomer.created_at
          })

      })
      .catch(err => {
          return res.status(401).json({
              message: 'Auth failed!' + err
          });
      });
}


exports.getInfoCustomer = (req, res, next) => {
  console.log('res: ' + req.userData.userId);
  Customer.findById({_id: req.userData.customerId})
    .then(documents => {
        if(documents) {
            res.status(200).json(documents);
        } else {
            res.status(404).json({ message: "Not found!" });
        }
  }).catch(error => {
      res.status(500).json({
          message: "Fetching info customer failed!"
      })
  })
}

exports.getInfoCustomerFromManager = (req, res, next) => {
    Customer.findById({_id: req.params.id })
      .then(documents => {
          if(documents) {
              res.status(200).json(documents);
          } else {
              res.status(404).json({ message: "Not found!" });
          }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching info customer failed!" + error
        })
    })
  }

exports.updateInfo = (req, res, next) => {

    const infoCustomer = new Customer({
        _id: req.userData.customerId,
        email: req.body.email,
        username: req.body.username,
        fullName: req.body.fullName,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address
    });

    console.log(infoCustomer);

    Customer.updateOne(
        { _id: req.userData.customerId}, infoCustomer
    ).then(result => {
        res.status(200).json({
            message: 'Update info successful!',
            customerInfo: result
        });
    }).catch(error => {
        res.status(500).json({
            message: "Couldn't update info!" + error
          })
    })
}
