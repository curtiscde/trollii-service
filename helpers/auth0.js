var requestPromise = require('request-promise');

let getToken = () => {
    return requestPromise({
        method: 'POST',
        url: `${process.env.auth0Domain}/oauth/token`,
        headers: {
            'content-type': 'application/json'
        },
        data: {
            'grant_type': 'client_credentials',
            'client_id': process.env.auth0ClientId,
            'client_secret': process.env.auth0ClientSecret,
            'audience': `${process.env.auth0Domain}/api/v2/`
        }
    });
}

let getUser = (userid) => {
    return requestPromise({
        url: `${process.env.auth0Domain}/api/v2/users/${userid}`,
        headers: {
            'authorization': `Bearer ${process.env.auth0Token}`
        }
    });
}

module.exports = {
    getToken,
    getUser
}