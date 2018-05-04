let hasUserListAccess = (list, userid) => (
    !!list.members.filter(member => member.userid == userid).length
)

module.exports = {
    hasUserListAccess
}