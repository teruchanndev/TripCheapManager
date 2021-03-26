const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user");

const router = express.Router();

router.post('/signup', (req, res, next) => {
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
                        error: err
                    });
                });
        });
    
});

router.post('/login', (req, res, next) => {
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
                'secret_this_should_be_longer',
                {expiresIn: '1h'}
            );
            console.log('token: ' + token);

            res.status(200).json({
                token: token
            })
            
        })
        .catch(err => {
            return res.status(401).json({
                message: 'Auth failed!'
            });
        });
})

module.exports = router;