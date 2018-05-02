var requestPromise = require('request-promise');

let getUser = (accessToken, userid) => {
    return requestPromise({
        url: `https://${process.env.auth0Domain}/api/v2/users/${userid}`,
        headers: {
            'authorization': `Bearer ${accessToken}`
        }
    });
}

module.exports = {
    getUser
}