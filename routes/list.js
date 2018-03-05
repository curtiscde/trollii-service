var mongoose = require('mongoose'); 

var List = mongoose.model('List', {
    text : String
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

    // create todo and send back all lists after creation
    app.post('/api/list', function(req, res) {

        console.log(req.body);

        // create a list, information comes from AJAX request from Angular
        List.create({
            text : req.body.text,
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

    });

    // delete a todo
    app.delete('/api/list/:list_id', function(req, res) {
        List.remove({
            _id : req.params.todo_id
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });
    });

};