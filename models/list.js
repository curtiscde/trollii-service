var mongoose = require('mongoose');

module.exports = mongoose.model('List', {
    userid: String,
    name : String
});