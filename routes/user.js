module.exports = function(app){

    app.get('/api/user/profile', function(req, res) {

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