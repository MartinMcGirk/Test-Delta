/**
 * Created by Martin on 02/08/2015.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CandidateSchema   = new Schema({
    candidate: {
        candidate_name: String,
        candidate_email: String,
        created_by: String,
        test_id: String,
        test_sent: Boolean,
        test: {
            test_name: String,
            time_limit: Number,
            test_instructions: String,
            questions: [{
                question_text: String,
                question_type: String,
                points_available: Number,
                points_awarded: Number,
                possible_answers: [{
                    answer: String,
                    correct: Boolean,
                    chosen: Boolean
                }],
                correct_answer: String,
                candidate_answer: String,
                desired_keywords: String,
                filler_code: String,
                answer_record: [{
                    answer_text: String,
                    answer_timestamp: Date
                }]
            }],
            test_started: Date,
            test_finished: Date,
            test_expires: Date
        }
    }
});

module.exports = mongoose.model('Candidate', CandidateSchema);