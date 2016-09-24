/**
 * Created by Martin on 16/08/2015.
 */
var jwt = require('jwt-simple');

var User     = require('../app/models/User');

var express = require('express'),
    passport = require('passport'),
    localStrategy = require('passport-local' ).Strategy;

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

var auth = {

    login: function(req, res, next) {

        var username = req.body.username || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }

        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return res.status(500).json({err: err});
            }
            if (!user) {
                return res.status(401).json({err: info});
            }
            req.logIn(user, function(err) {
                if (err) {
                    return res.status(500).json({err: 'Could not log in user'});
                }
                res.json(genToken(user));
            });
        })(req, res, next);
    },

    register: function(req, res) {
        var username = req.body.username || '';
        var password = req.body.password || '';

        if (username == '' || password == '') {
            res.status(401);
            res.json({
                "status": 401,
                "message": "Invalid credentials"
            });
            return;
        }

        User.register(new User({ username: req.body.username }), req.body.password, function(err, account) {            if (err) {
                return res.status(500).json({err: err});
            }
            passport.authenticate('local')(req, res, function () {
                return res.status(200).json({status: 'Registration successful!'});
            });
        });
    },

    validateUser: function(username, callback) {
        User.findOne({ 'username': username}, 'username name role', function(err, user) {
            if (user) {
                //console.log(user);
                callback(user);
            } else {
                callback(null);
            }
        });
    },
}

// private method
function genToken(user) {
    var expires = expiresIn(7); // 7 days
    var token = jwt.encode({
        exp: expires,
        user: user
    }, require('../config/secret')());

    return {
        token: token,
        expires: expires,
        user: user
    };
}

function expiresIn(numDays) {
    var dateObj = new Date();
    return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;