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

let listModel = (lists, auth0AccessToken) => {

    let memberUserIds = getListsMembers(lists);

    // memberUserIds.forEach(userId => {
    //     console.log(userid);
    // });

    return lists;
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