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

                        if (err){
                            console.log(err);
                        }                        

                        list.items.push({
                            name: req.body.name
                        });
                        list.save();

                        res.json(list);
                    });

                }

            });

        }

    });

    apiRoutes.delete('/item/:listid/:itemid', authJwt.jwtCheck, function(req, res) {
       
        checkUserHasListAccess(req.params.listid, req.user.sub, function(err, hasAccess){

            if (err)
                res.send(err)

            if (!hasAccess){
                res.status(500).send({ error: 'Access Denied'});
            }
            else {

                console.log('Access to remove');

                List.findById(req.params.listid, function(err, list){
                    list.items.remove({_id: req.params.itemid});
                    list.save();
                    res.json(list);
                });

            }

        });

    });

}

var checkUserHasListAccess = function(listid, userid, callback){
    List.findById(listid, function(err, list){
        var hasAccess = list && (list.ownerid == userid);
        callback(err, hasAccess);
    });
}

var getItems = function(items, listid){
    return items.filter(function(item){
        return item.listid == listid;
    });
}