module.exports = function(apiRoutes){

    apiRoutes.get('/user/profile', function(req, res) {

        if (!req.isAuthenticated()){
            res.send({
                authenticated: false
            });
        }
        else{


            res.send({
                authenticated: true
            })

        }

    });

}