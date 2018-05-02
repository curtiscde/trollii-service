var auth0Helper = require('./auth0');

var itemdata = require('../data/item');

let getUserLists = (lists, userid) => (
    lists.filter(function(list){
        return hasUserListAccess(list, userid);
    }).map(list => publicModel(list, userid))
)

let hasUserListAccess = (list, userid) => (
    !!list.members.filter(member => member.userid == userid).length
)

let publicModel = (list, userid) => (
    {
        _id: list._id,
        isowner: (list.ownerid === userid),
        name: list.name,
        items: list.items.map(item => {
            return {
                _id: item._id,
                name: item.name,
                emoji: emojiByItemName(itemdata, item.name)
            }
        }),
        members: list.members.map(member => {
            return {
                userid: member.userid
            }
        })
    }
);

let emojiByItemName = (itemdata, name) => {
    let itemDataEmoji = itemdata.items.find(itemm => itemm.name.toLowerCase() === name.toLowerCase());
    return itemDataEmoji ? itemDataEmoji.emoji : null;
}

let listModel = (auth0AccessToken, lists, thisUserid) => {
    return new Promise((resolve, reject) => {
        let memberUserIds = getListsMembers(lists);
        let userPromises = [];

        memberUserIds.forEach(userId => {
            userPromises.push(auth0Helper.getUser(auth0AccessToken, userId));
        });

        Promise.all(userPromises).then(auth0Users => {
            
            var model = lists.map(list => {
                return {
                    _id: list._id,
                    isowner: (list.ownerid === thisUserid),
                    name: list.name,
                    items: list.items.map(item => {
                        return {
                            _id: item._id,
                            name: item.name,
                            emoji: emojiByItemName(itemdata, item.name)
                        }
                    }),
                    members: list.members.map(member => {
                        let auth0User = JSON.parse(auth0Users.find(u => JSON.parse(u).user_id === member.userid));
                        return {
                            userid: member.userid,
                            picture: auth0User.picture,
                        }
                    })
                };
            });

            resolve(model);
        });
    });
};

let getListsMembers = (lists) => {
    var userids = lists.map(list => list.members.map(member => member.userid));
    return [].concat.apply([], userids).filter(function(elem, index, self) {
        return index == self.indexOf(elem);
    });
};

module.exports = {
    getUserLists,
    hasUserListAccess,
    publicModel,
    emojiByItemName,
    listModel,
    getListsMembers
};