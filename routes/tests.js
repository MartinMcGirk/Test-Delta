/**
 * Created by Martin on 16/08/2015.
 */
var jwt = require('jwt-simple');
var Test     = require('../app/models/Test');

var tests = {

    getAll: function(req, res) {
        var userId = getUserIdFromToken(req);
        Test.find({'test.created_by': userId}, function(err, tests){
            res.json(tests);
        })
    },

    getOne: function(req, res) {
        Test.findOne({_id: req.params.id, 'test.created_by': getUserIdFromToken(req)}, function(err, test) {
            if (err)
                res.send(err);

            res.json(test);
        });
    },

    create: function(req, res) {
        var test = new Test();      // create a new instance of the Test model
        test.test = req.body.test;  // set the test name (comes from the request)
        test.test.created_by = getUserIdFromToken(req);
        // save the test and check for errors
        test.save(function(err, test) {
            if (err)
                res.send(err);

            res.json({ testId: test.id });
        });
    },

    update: function(req, res) {
        Test.findOne({_id: req.params.id, 'test.created_by': getUserIdFromToken(req)}, function(err, test) {
            if (err) {
                res.send(err);
            }

            test.update(req.body, function(error, course) {
                if(error) return next(error);

                res.json(course);
            });
        });
    },

    delete: function(req, res) {
        Test.remove({_id: req.params.id, 'test.created_by': getUserIdFromToken(req)}, function(err, test) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    }
};

function getUserIdFromToken(req) {
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var decoded = jwt.decode(token, require('../config/secret.js')());
    return decoded.user._id;
}

module.exports = tests;