var mongoose = require('mongoose');

module.exports = mongoose.model('Item', {
    userid: String,
    name : String
});