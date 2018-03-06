// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var passport = require('passport');
var flash    = require('connect-flash');
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var session      = require('express-session');
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

var dbconfig = require('./config/database.js');

// configuration =================

mongoose.connect(dbconfig.url)
.then(function(r){
    console.log('DB connected');
})
.catch(console.log);;     // connect to mongoDB database on modulus.io

require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// required for passport
app.use(session({ secret: 'secretpasskey' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes
require('./routes/auth.js')(app, passport);
require('./routes/list.js')(app);
require('./routes/item.js')(app);


app.listen(8080);
console.log("App listening on port 8080");