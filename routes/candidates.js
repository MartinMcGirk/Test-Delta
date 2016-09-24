/**
 * Created by Martin on 16/08/2015.
 */
var jwt = require('jwt-simple');
var Candidate     = require('../app/models/Candidate');

var candidates = {

    getAll: function(req, res) {
        var userId = getUserIdFromToken(req);
        Candidate.find({'candidate.created_by': userId}, function(err, candidates){
            res.json(candidates);
        })
    },

    getOne: function(req, res) {
        Candidate.findOne({_id: req.params.id, 'candidate.created_by': getUserIdFromToken(req)}, function(err, candidate) {
            if (err)
                res.send(err);

            res.json(candidate);
        });
    },

    getCandidateForTakeTest: function(req, res) {
        Candidate.findOne({_id: req.params.id}, 'candidate.candidate_name candidate.candidate_email candidate.test.test_name candidate.test.time_limit candidate.test.test_instructions candidate.test.test_started candidate.test.test_finished candidate.test.test_expires', function(err, candidate) {
            if (err)
                res.send(err);

            res.json(candidate);
        });
    },

    takeTest: function(req, res) {
        Candidate.findOne({_id: req.params.id}, function(err, candidateOne) {
            if (err)
                res.send(err);

            if (!candidateOne.candidate.test.test_started) {
                var now = new Date();
                var timeLimit = candidateOne.candidate.test.time_limit;

                var expiryTime = new Date (now);
                expiryTime.setMinutes (now.getMinutes() + timeLimit);

                Candidate.update({ _id: req.params.id }, { $set: { 'candidate.test.test_started': now, 'candidate.test.test_expires': expiryTime}}, function(error, course) {
                    if(error) return next(error);

                    Candidate.findOne({_id: req.params.id}, function(err, candidate) {
                        if (err)
                            res.send(err);

                        res.json(candidate);
                    });
                });
            } else {
                Candidate.findOne({_id: req.params.id}, function(err, candidate) {
                    if (err)
                        res.send(err);

                    res.json(candidate);
                });
            }
        });
    },

    saveTest: function(req, res) {
        Candidate.findOne({_id: req.params.id}, function(err, candidate) {
            if (err) {
                res.send(err);
            }
            var candidateData = req.body;
            candidateData.candidate.test.test_finished = new Date();
            candidate.update(req.body, function(error, course) {
                if(error) return next(error);

                res.json(course);
            });
        });
    },

    create: function(req, res) {
        var candidate = new Candidate();      // create a new instance of the Test model
        candidate.candidate = req.body;  // set the test name (comes from the request)
        candidate.candidate.created_by = getUserIdFromToken(req);
        // save the test and check for errors
        candidate.save(function(err, candidate) {
            if (err)
                res.send(err);

            res.json({ candidateId: candidate.id });
        });
    },

    update: function(req, res) {
        Candidate.findOne({_id: req.params.id, 'candidate.created_by': getUserIdFromToken(req)}, function(err, candidate) {
            if (err) {
                res.send(err);
            }

            candidate.update(req.body, function(error, course) {
                if(error) return next(error);

                res.json(course);
            });
        });
    },

    delete: function(req, res) {
        Candidate.remove({_id: req.params.id, 'candidate.created_by': getUserIdFromToken(req)}, function(err, candidate) {
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

module.exports = candidates;