/**
 * Created by Martin on 02/08/2015.
 */
var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var TestSchema   = new Schema({
    test: {
        test_name: String,
        created_by: String,
        time_limit: Number,
        test_instructions: String,
        questions: [{
            question_text: String,
            question_type: String,
            points_available: Number,
            possible_answers: [{
                answer: String,
                correct: Boolean,
                chosen: Boolean
            }],
            correct_answer: String,
            desired_keywords: String,
            filler_code: String
        }]
    }
});

module.exports = mongoose.model('Test', TestSchema);