var mongoose = require('mongoose'); 

var Item = mongoose.model('Item', {
    name : String
});

module.exports = function(app){

    app.get('/api/item', function(req, res) {
        // use mongoose to get all lists in the database
        Item.find(function(err, items) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(items); // return all lists in JSON format
        });
    });

}