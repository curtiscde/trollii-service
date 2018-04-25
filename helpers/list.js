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
            let itemDataEmoji = itemdata.items.find(itemm => itemm.name === item.name);
            return {
                name: item.name,
                emoji: itemDataEmoji ? itemDataEmoji.emoji : null
            }
        })
    }
)

module.exports = {
    getUserLists,
    hasUserListAccess,
    publicModel
};