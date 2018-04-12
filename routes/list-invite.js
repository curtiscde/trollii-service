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

                if (list.ownerid !== req.user.sub){
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

    apiRoutes.post('/list-invite/accept', authJwt.jwtCheck, function(req, res){

        console.log('list-invite accept');

        let listid = req.body.listid;
        let inviteid = req.body.inviteid;
        let email = req.user.email;
        let userid = req.user.sub;

        List.findById(listid, function(err, list){
            if (err)
                res.send(err)

            console.log('user', req.user);
            console.log('list', list);
            
            let invite = list.invites.find(inv => inv._id == inviteid && inv.email == email);

            console.log('invite', invite);

            if (invite){
                addUserToListMembers(list, userid);
                res.json({ success: true });
            }
            else{
                res.status(500).send({ error: 'Invite not found' });
            }
            
        });
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

    let addUserToListMembers = (list, userid) => {
        list.members.push({
            userid: userid
        });
        list.save();
    }
};