var mongoose = require('mongoose'); 

var Item = require('../models/item');
var List = require('../models/list');

module.exports = function(app){

    app.get('/api/item/:listid', isLoggedIn, function(req, res) {

        checkUserHasListAccess(req.params.listid, req.user._id, function(err, hasAccess){

            if (err)
                res.send(err)

            if (!hasAccess){
                res.status(500).send({ error: 'Access Denied'});
            }
            else {

                Item.find(function(err, items) {
                    if (err)
                        res.send(err)
                    res.json(getItems(items, req.params.listid));
                });

            }

        });
        
    });

    app.post('/api/item', isLoggedIn, function(req, res) {

        if (!req.body.listid || !req.body.name){
            res.status(500).send({ error: 'listid and name cannot be blank' });
        }
        else{

            checkUserHasListAccess(req.body.listid, req.user._id, function(err, hasAccess){

                if (err)
                    res.send(err)

                if (!hasAccess){
                    res.status(500).send({ error: 'Access Denied'});
                }
                else {

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

    });

}

var isLoggedIn = function(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.status(500).send({ error: 'Not logged in' });
} 

var checkUserHasListAccess = function(listid, userid, callback){
    List.findById(listid, function(err, list){
        var hasAccess = (list.userid == userid);
        callback(err, hasAccess);
    });
}

var getItems = function(items, listid){
    return items.filter(function(item){
        return item.listid == listid;
    });
}