var mongoose = require('mongoose');
var nodemailer = require("nodemailer");
var sparkpost = require("sparkpost");

var authJwt = require('../auth/jwt.js');

var List = require('../models/list');

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

                    var inviteid = list.invites.find((invite) => {
                        return invite.email === req.body.email
                    })._id;
                    
                    emailInvite(req.body.email, inviteid, () => {
                        res.json({ success: true });
                    });

                }
                
            });

        }

    });


    let emailInvite = (email, inviteid, cb) => {

        const client = new sparkpost(process.env.sparkpostAPI);

        client.transmissions.send({
            content: {
                from: process.env.noreplyemail,
                subject: 'Invite from Trollii',
                html: emailHtml(process.env.webAppUrl, inviteid)
            },
            recipients: [{
                address: email
            }]
        })
        .then(data => {
            console.log('Email sent');
            console.log(data);

            cb();
        })
        .catch(err => {
            console.log('Email could not be sent');
            console.log(err)
        });

    }

    let emailHtml = (webAppUrl, inviteid) => {
        return `<a href='${webAppUrl}/list/invite/${inviteid}'>Accept Invite</a>`;
    }

};