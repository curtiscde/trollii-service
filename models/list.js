var mongoose = require('mongoose');

module.exports = mongoose.model('List', {
    userid: String,
    name : String,
    items : [{
        name : String
    }],
    invites: [{
        userid: String,
        listid : String,
        email: String,
        date: Date
    }]
});