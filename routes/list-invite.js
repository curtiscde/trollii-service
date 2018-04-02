var mongoose = require('mongoose');

var ListInvite = require('../models/list-invite');

var authJwt = require('../auth/jwt.js');

module.exports = function(apiRoutes){

    // get all lists
    apiRoutes.post('/list-invite', authJwt.jwtCheck, function(req, res) {
       
        

    });

};