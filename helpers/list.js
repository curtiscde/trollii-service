
let getUserLists = (lists, userid) => (
    lists.filter(function(list){
        return hasUserListAccess(list, userid);
    })
)

let hasUserListAccess = (list, userid) => (
    !!list.members.filter(member => member.userid == userid).length
)

module.exports = {
    getUserLists,
    hasUserListAccess
};