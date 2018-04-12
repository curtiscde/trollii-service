var mongoose = require('mongoose');

var List = require('../models/list');

var authJwt = require('../auth/jwt.js');

var getItems = function(lists, userid){
    return lists.filter(function(list){
        return list.ownerid == userid;
    });
}

module.exports = function(apiRoutes){

    // get all lists
    apiRoutes.get('/list', authJwt.jwtCheck, function(req, res) {
        List.find(function(err, lists) {
            if (err)
                res.send(err)

            res.json(getItems(lists, req.user.sub));
        });
    });

    // create list and send back all lists after creation
    apiRoutes.post('/list', authJwt.jwtCheck, function(req, res) {

        if (!req.body.name){
            res.status(500).send({ error: 'Name cannot be blank' });
        }
        else{

            List.create({
                ownerid: req.user.sub,
                name : req.body.name,
                members: [{
                    userid: req.user.sub
                }]
            }, function(err, todo) {
                if (err)
                    res.send(err);

                // get and return all the lists after you create another
                List.find(function(err, lists) {
                    if (err)
                        res.send(err)
                    res.json(getItems(lists, req.user.sub));
                });
            });

        }

    });

    // delete a list
    apiRoutes.delete('/list/:list_id', authJwt.jwtCheck, function(req, res) {

        List.remove({
            _id : req.params.list_id,
            userid: req.user.sub
        }, function(err, list) {
            if (err)
                res.send(err);

            // get and return all the lists after you delete another
            List.find(function(err, lists) {
                if (err)
                    res.send(err)
                res.json(getItems(lists, req.user.sub));
            });
        });
    });

};