let itemData = require('../data/item');

var authJwt = require('../auth/jwt.js');

module.exports = function(apiRoutes){

    apiRoutes.get('/item-options', authJwt.jwtCheck, (req, res) => {
       res.json(itemData.items); 
    });

}