var mongoose = require('mongoose');

var List = require('../models/list');

var authJwt = require('../auth/jwt.js');

module.exports = function(apiRoutes){

    // get all lists
    apiRoutes.post('/list-invite', authJwt.jwtCheck, function(req, res) {

        if (!req.body.listid ||
            !req.body.email){
            
            res.status(500).send({ error: 'Missing fields' });

        }
        else {

            List.findById(req.body.listid, function(err, list){

                if (err){
                    console.log(err);
                }

                if (list.userid !== req.user.sub){
                    res.status(500).send({ error: 'Permission denied' });
                }
                else{

                    list.invites.push({
                        userid: req.user.sub,
                        email: req.body.email,
                        date: new Date()
                    });
                    list.save();
    
                    res.json({ success: true });

                }
                
            });

        }

    });

};