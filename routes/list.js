var mongoose = require('mongoose'); 

var List = mongoose.model('List', {
    userid: String,
    name : String
});

module.exports = function(app){

    // get all lists
    app.get('/api/list', isLoggedIn, function(req, res) {
        List.find(function(err, lists) {
            if (err)
                res.send(err)

            res.json(getItems(lists, req.user._id));
        });
    });

    // create list and send back all lists after creation
    app.post('/api/list', isLoggedIn, function(req, res) {

        if (!req.body.name){
            res.status(500).send({ error: 'Name cannot be blank' });
        }
        else{

            List.create({
                userid: req.user._id,
                name : req.body.name
            }, function(err, todo) {
                if (err)
                    res.send(err);

                // get and return all the lists after you create another
                List.find(function(err, lists) {
                    if (err)
                        res.send(err)
                    res.json(getItems(lists, req.user._id));
                });
            });

        }

    });

    // delete a list
    app.delete('/api/list/:list_id', function(req, res) {
        List.remove({
            _id : req.params.list_id
        }, function(err, list) {
            if (err)
                res.send(err);

            // get and return all the lists after you delete another
            List.find(function(err, lists) {
                if (err)
                    res.send(err)
                res.json(lists);
            });
        });
    });

    var getItems = function(lists, userid){
        return lists.filter(function(list){
            return list.userid == userid;
        });
    }

};

var isLoggedIn = function(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.status(500).send({ error: 'Not logged in' });
}   