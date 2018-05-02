var mongoose = require('mongoose');

var List = require('../models/list');

var authJwt = require('../auth/jwt.js');

var listHelper = require('../helpers/list');

module.exports = function(apiRoutes){

    // get all lists
    apiRoutes.get('/list', authJwt.jwtCheck, function(req, res) {

        List.find({
            $or:[
                { 'ownerid': req.user.sub },
                { 'members.userid': req.user.sub }
            ]
        }, (err, lists) => {
            res.json(listHelper.listModel(lists, 'goo'));
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
                    res.json(listHelper.getUserLists(lists, req.user.sub));
                });
            });

        }

    });

    // delete a list
    apiRoutes.delete('/list/:list_id', authJwt.jwtCheck, function(req, res) {

        List.remove({
            _id : req.params.list_id,
            ownerid: req.user.sub
        }, function(err, list) {
            if (err)
                res.send(err);

            // get and return all the lists after you delete another
            List.find(function(err, lists) {
                if (err)
                    res.send(err)
                res.json(listHelper.getUserLists(lists, req.user.sub));
            });
        });
    });

    apiRoutes.delete('/list/:list_id/member', authJwt.jwtCheck, function(req, res){

        List.findById(req.params.list_id, (err, list) => {
            if(err){
                res.send(err);
            }

            let userid = req.user.sub;
            let member = list.members.find((m) => m.userid === userid && m.userid !== list.ownerid);

            if (!member){
                res.status(500).send({ error: 'Member not found' });
            }
            else{
                list.members.remove({_id: member._id});
                list.save();
                res.json({success:true});
            }

        });

    });

};