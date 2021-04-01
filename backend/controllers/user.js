const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user");

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
      .then(hash => {
          const user = new User({
              email: req.body.email,
              username: req.body.username,
              password: hash
          });
          user.save()
              .then(result => {
                  res.status(201).json({
                      message: 'User created!',
                      result: result
                  });
              })
              .catch(err => {
                  res.status(500).json({
                      message: 'Invalid authentication credentials!'
                  });
              });
      });
}

exports.userLogin = (req, res, next) => {
  let fetchUser;
  User.findOne({email: req.body.email})
      .then(user => {
          if(!user) {
              return res.status(401).json({
                  message: 'Auth failed!'
              });
          }
          console.log('user check: ' + user);
          fetchUser = user;
          console.log(req.body.password + ' and '+ user.password);
          return bcrypt.compare(req.body.password, user.password);
      })
      .then(result => {
          console.log('result: ' + result);
          if(!result) {
              return res.status(401).json({
                  message: 'Auth failed!'
              });
          }
          const token = jwt.sign(
              {email: fetchUser.email, userId: fetchUser._id},
              process.env.JWT_KEY,
              {expiresIn: '1h'}
          );
          console.log('token: ' + token);

          res.status(200).json({
              token: token,
              expiresIn: 3600,
              userId: fetchUser._id,
              username: fetchUser.username
          })

      })
      .catch(err => {
          return res.status(401).json({
              message: 'Auth failed!'
          });
      });
}

exports.getUsername = (req, res, next) => {
    User.findById(req.params.id).then(user => {
        if (user) {
        res.status(200).json(user);
        } else {
        res.status(404).json({ message: "Username not found!" });
        }
    });
}