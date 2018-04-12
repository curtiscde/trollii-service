
let getUserLists = (lists, userid) => (
    lists.filter(function(list){
        return list.members.filter(member => member.userid == userid).length;
    })
)

module.exports = {
    getUserLists
};