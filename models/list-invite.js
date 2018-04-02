var mongoose = require('mongoose');

module.exports = mongoose.model('ListInvite', {
    userid: String,
    listid : String,
    email: String,
    date: Date
});