var mongoose = require('mongoose'); 

var Item = require('../models/item');
var List = require('../models/list');

var authJwt = require('../auth/jwt.js');

module.exports = function(apiRoutes){

    apiRoutes.get('/item/:listid', authJwt.jwtCheck, function(req, res) {

        checkUserHasListAccess(req.params.listid, req.user.sub, function(err, hasAccess){

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

    apiRoutes.post('/item', authJwt.jwtCheck, function(req, res) {

        if (!req.body.listid || !req.body.name){
            res.status(500).send({ error: 'listid and name cannot be blank' });
        }
        else{

            checkUserHasListAccess(req.body.listid, req.user.sub, function(err, hasAccess){

                if (err)
                    res.send(err)

                if (!hasAccess){
                    res.status(500).send({ error: 'Access Denied'});
                }
                else {

                    List.findById(req.body.listid, function(err, list){

                        console.log(req.body.listid);

                        list.items.push({
                            name: 'Foo bar'
                        });
                        console.log(list);
                        List.save();

                        res.json(List);

                    });

                    // Item.create({
                    //     listid: req.body.listid,
                    //     name : req.body.name,
                    //     userid: req.user._id
                    // }, function(err, items) {
                    //     if (err)
                    //         res.send(err);

                    //     Item.find(function(err, items) {
                    //         if (err)
                    //             res.send(err)
                    //         res.json(getItems(items, req.body.listid));
                    //     });
                    // });

                }

            });

        }

    });

    apiRoutes.delete('/item/:itemid', authJwt.jwtCheck, function(req, res) {
       
        checkUserHasListAccess(req.body.listid, req.user.sub, function(err, hasAccess){

            if (err)
                res.send(err)

            if (!hasAccess){
                res.status(500).send({ error: 'Access Denied'});
            }
            else {

                Item.remove({
                    _id : req.params.itemid,
                }, function(err, item) {
                    if (err)
                        res.send(err);
        
                    res.send(true);
                });

            }

        });

    });

}

var checkUserHasListAccess = function(listid, userid, callback){
    List.findById(listid, function(err, list){
        var hasAccess = list && (list.userid == userid);
        callback(err, hasAccess);
    });
}

var getItems = function(items, listid){
    return items.filter(function(item){
        return item.listid == listid;
    });
}