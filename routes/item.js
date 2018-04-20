var mongoose = require('mongoose'); 

var Item = require('../models/item');
var List = require('../models/list');

var authJwt = require('../auth/jwt.js');

var listHelper = require('../helpers/list');

module.exports = function(apiRoutes){

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

                        res.json(listHelper.publicModel(list, req.user.sub));
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
                    res.json(listHelper.publicModel(list, req.user.sub));
                });

            }

        });

    });

}

var checkUserHasListAccess = function(listid, userid, callback){
    List.findById(listid, function(err, list){
        var hasAccess = listHelper.hasUserListAccess(list, userid);
        callback(err, hasAccess);
    });
}