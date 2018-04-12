var mongoose = require('mongoose');

module.exports = mongoose.model('List', {
    ownerid: String,
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