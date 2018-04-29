var pjson = require('../package.json');

module.exports = function(apiRoutes){

    apiRoutes.get('/version', (req, res) => {
        res.json({ version: pjson.version });
    });

}