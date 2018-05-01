var requestPromise = require('request-promise');

let getUser = (userid) => {
    return requestPromise({
        url: `${process.env.auth0Domain}/api/v2/users/${userid}`,
        headers: {
            'authorization': `Bearer ${process.env.auth0Token}`
        }
    });
}

module.exports = {
    getUser
}