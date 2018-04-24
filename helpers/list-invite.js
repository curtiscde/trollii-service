let validListInviteEmail = (listInvite, email) => {
    return listInvite &&
            listInvite.email &&
            listInvite.email.toLowerCase() === email.toLowerCase();
};

module.exports = {
    validListInviteEmail
};