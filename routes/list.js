var mongoose = require('mongoose');
var expressJwt = require('express-jwt');
var jwks = require('jwks-rsa');

var jwtCheck = expressJwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://curt.auth0.com/.well-known/jwks.json"
    }),
    audience: 'https://trollii.com/',
    issuer: "https://curt.auth0.com/",
    algorithms: ['RS256'],
    getToken: function fromHeaderOrQuerystring (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
          return req.query.token;
        }
        return null;
    }
});

var List = require('../models/list');

module.exports = function(apiRoutes){

    // get all lists
    apiRoutes.get('/list', jwtCheck, function(req, res) {
        List.find(function(err, lists) {
            if (err)
                res.send(err)

            res.json(getItems(lists, req.user._id));
        });
    });

    // create list and send back all lists after creation
    apiRoutes.post('/list', jwtCheck, function(req, res) {

        if (!req.body.name){
            res.status(500).send({ error: 'Name cannot be blank' });
        }
        else{

            List.create({
                userid: req.user._id,
                name : req.body.name
            }, function(err, todo) {
                if (err)
                    res.send(err);

                // get and return all the lists after you create another
                List.find(function(err, lists) {
                    if (err)
                        res.send(err)
                    res.json(getItems(lists, req.user._id));
                });
            });

        }

    });

    // delete a list
    apiRoutes.delete('/list/:list_id', jwtCheck, function(req, res) {

        List.remove({
            _id : req.params.list_id,
            userid: req.user._id
        }, function(err, list) {
            if (err)
                res.send(err);

            // get and return all the lists after you delete another
            List.find(function(err, lists) {
                if (err)
                    res.send(err)
                res.json(getItems(lists, req.user._id));
            });
        });
    });

    var getItems = function(lists, userid){
        return lists.filter(function(list){
            return list.userid == userid;
        });
    }

};