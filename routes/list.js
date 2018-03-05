var mongoose = require('mongoose'); 

var List = mongoose.model('List', {
    name : String
});

module.exports = function(app){

    // get all lists
    app.get('/api/list', function(req, res) {
        // use mongoose to get all lists in the database
        List.find(function(err, lists) {
            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(lists); // return all lists in JSON format
        });
    });

    // create list and send back all lists after creation
    app.post('/api/list', function(req, res) {

        if (!req.body.name){
            res.status(500).send({ error: 'Name cannot be blank' });
        }
        else{

            List.create({
                name : req.body.name,
                done : false
            }, function(err, todo) {
                if (err)
                    res.send(err);

                // get and return all the lists after you create another
                List.find(function(err, todos) {
                    if (err)
                        res.send(err)
                    res.json(todos);
                });
            });

        }

    });

    // delete a todo
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

};