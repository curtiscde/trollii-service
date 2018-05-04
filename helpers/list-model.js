var auth0Helper = require('./auth0');

var User = require('../models/user');

var itemdata = require('../data/item');

let listModel = (auth0AccessToken, lists, thisUserid) => {
    return new Promise((resolve, reject) => {
        let memberUserIds = getListsMembers(lists);
        let auth0UserPromises = [];

        memberUserIds.forEach(userId => {
            auth0UserPromises.push(auth0Helper.getUser(auth0AccessToken, userId));
        });

        User.find({
            'userid': { $in: memberUserIds }
        }, (err, users) => {

            //Return all promises as success, even if auth0 could not find the user
            Promise.all(auth0UserPromises.map(p => p.catch(() => undefined))).then(auth0Users => {
                
                var model = lists.map(list => {
                    return {
                        _id: list._id,
                        isowner: (list.ownerid === thisUserid),
                        name: list.name,
                        items: list.items.map(item => itemModel(item, itemdata)),
                        members: list.members.map(member => memberModel(member, users, auth0Users))
                    };
                });

                resolve(model);
            });

        })
    });
};

let getListsMembers = (lists) => {
    var userids = lists.map(list => list.members.map(member => member.userid));
    return [].concat.apply([], userids).filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    });
};

let itemModel = (item, itemdata) => (
    {
        _id: item._id,
        name: item.name,
        emoji: emojiByItemName(itemdata, item.name)
    }
);

let emojiByItemName = (itemdata, name) => {
    let itemDataEmoji = itemdata.items.find(itemm => itemm.name.toLowerCase() === name.toLowerCase());
    return itemDataEmoji ? itemDataEmoji.emoji : null;
}

let memberModel = (member, users, auth0Users) => {
    
    let user = users.find(u => u.userid === member.userid);
    let auth0User = auth0Users.find(u => u && JSON.parse(u).user_id === member.userid);
    
    return {
        userid: member.userid,
        displayname: user && user.displayname,
        picture: auth0User && JSON.parse(auth0User).picture,
    };
}

module.exports = {
    emojiByItemName,
    listModel,
    getListsMembers
};