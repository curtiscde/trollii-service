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
        })
    }
)

let emojiByItemName = (itemdata, name) => {
    let itemDataEmoji = itemdata.items.find(itemm => itemm.name.toLowerCase() === name.toLowerCase());
    return itemDataEmoji ? itemDataEmoji.emoji : null;
}

module.exports = {
    getUserLists,
    hasUserListAccess,
    publicModel,
    emojiByItemName
};