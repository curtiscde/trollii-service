var mongoose = require('mongoose');
var nodemailer = require("nodemailer");
var sparkpost = require("sparkpost");

var authJwt = require('../auth/jwt.js');

var List = require('../models/list');
var ListInvite = require('../models/list-invite');

module.exports = function(apiRoutes){

    // get all lists
    apiRoutes.post('/list-invite', authJwt.jwtCheck, function(req, res) {

        let listid = req.body.listid;
        let email = req.body.email;
        let userid = req.user.sub;

        if (!listid ||
            !email){
            
            res.status(500).send({ error: 'Missing fields' });

        }
        else {

            
            List.findById(listid, (err, list) => {

                if (err){
                    console.log(err);
                }

                if (list.ownerid !== userid){
                    res.status(500).send({ error: 'Permission denied' });
                }
                else{

                    ListInvite.find((err, listInvites) => {

                        let existingListInvite = listInvites.find(invite => invite.listid === listid &&
                                                                            invite.email === email);

                        //Add to invites if one doesn't already exist for this email
                        if (!existingListInvite){

                            ListInvite.create({
                                userid: userid,
                                listid: listid,
                                email: email,
                                date: new Date()
                            }, (err, listInvite) => {
                                if (err)
                                    res.send(err);
                                
                                emailInvite(req.body.email, listInvite._id, () => {
                                    res.json({ success: true });
                                });

                            });

                        }
                        else{
                            emailInvite(existingListInvite.email, existingListInvite._id, () => {
                                res.json({ success: true });
                            });
                        }

                    });
                }

            });

        }

    });

    apiRoutes.post('/list-invite/accept', authJwt.jwtCheck, function(req, res){

        let inviteid = req.body.inviteid;
        let email = req.body.email;
        let userid = req.user.sub;

        ListInvite.findById(inviteid, function(err, listInvite){
            if (err)
                res.send(err)

            console.log('listInvite', listInvite);

            if (listInvite.email === email){

                List.findById(listInvite.listid, (err, list) => {

                    if (list.ownerid !== userid){
    
                        addUserToListMembers(list, userid);
                        removeUserInvite(list, email);
                        list.save();
                        res.json({
                            listid: list._id
                        });
                        
                    }

                });

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
        return `<a href='${webAppUrl}/list/invite/entry/${inviteid}'>Accept Invite</a>`;
    }

    let addUserToListMembers = (list, userid) => {
        list.members.push({
            userid: userid
        });
    }

    let removeUserInvite = (inviteId) => {
        ListInvite.remove({
            _id: inviteId
        });
    }
};