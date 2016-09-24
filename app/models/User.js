/**
 * Created by Martin on 02/08/2015.
 */
//var mongoose     = require('mongoose');
//var Schema       = mongoose.Schema;
//
//var UserSchema   = new Schema({
//    username: { type: String, required: true, unique: true },
//    password: { type: String, required: true}
//});
//
//module.exports = mongoose.model('User', UserSchema);

// user model
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    passportLocalMongoose = require('passport-local-mongoose');


var User = new Schema({
    username: String,
    password: String,
    role: String,
    name: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('users', User);