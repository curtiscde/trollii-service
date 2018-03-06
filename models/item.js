var mongoose = require('mongoose');

module.exports = mongoose.model('Item', {
    listid: String,
    userid: String,
    name : String
});