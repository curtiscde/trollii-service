var mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    userid: String,
    displayname: String
});