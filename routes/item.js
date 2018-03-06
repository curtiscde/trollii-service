var mongoose = require('mongoose'); 

var Item = mongoose.model('Item', {
    listid: String,
    userid: String,
    name : String
});

module.exports = function(app){

    app.get('/api/item/:listid', function(req, res) {
        // use mongoose to get all lists in the database

        if (!req.isAuthenticated()){
            res.status(500).send({ error: 'Not logged in'});
        }
        else{

            Item.find(function(err, items) {
                if (err)
                    res.send(err)
                res.json(getItems(items, req.params.listid));
            });

        }
    });

    app.post('/api/item', function(req, res) {

        if (!req.body.listid || !req.body.name){
            res.status(500).send({ error: 'listid and name cannot be blank' });
        }
        else{

            Item.create({
                listid: req.body.listid,
                name : req.body.name,
                userid: req.user._id
            }, function(err, items) {
                if (err)
                    res.send(err);

                Item.find(function(err, items) {
                    if (err)
                        res.send(err)
                    res.json(getItems(items, req.body.listid));
                });
            });

        }

    });

}

var userHasListAccess = function(){

}

var getItems = function(items, listid){
    return items.filter(function(item){
        return item.listid == listid;
    });
}