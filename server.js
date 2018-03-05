// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

var dbconfig = require('./config.js');

// configuration =================

mongoose.connect(dbconfig.uri)
.then(function(r){
    console.log('sdsd');
})
.catch(console.log);;     // connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// model
var List = mongoose.model('List', {
    text : String
});

// routes

// api ---------------------------------------------------------------------
    // get all todos
    app.get('/api/list', function(req, res) {

        console.log('1. List', List);

        // use mongoose to get all lists in the database
        List.find(function(err, lists) {

            console.log('2. lists', lists);

            // if there is an error retrieving, send the error. nothing after res.send(err) will execute
            if (err)
                res.send(err)

            res.json(lists); // return all todos in JSON format
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
            Todo.find(function(err, todos) {
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

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");