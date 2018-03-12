// set up ========================
var express  = require('express');
var app      = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var jwt    = require('jsonwebtoken');
var passport = require('passport');
var flash    = require('connect-flash');
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)


// configuration =================

if (!process.env.prod){
    var env = require('./env.js');
}
var authConfig = require('./config/auth.js')(process.env);

var port = process.env.PORT || 8080;

mongoose.connect(process.env.dbconnection)
.then(function(r){
    console.log('DB connected');
})
.catch(console.log);

app.set('superSecret', authConfig.secret);

require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());

// required for passport
app.use(passport.initialize());
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
    next();
  });

// routes
var apiRoutes = express.Router(); 

require('./routes/user.js')(apiRoutes);
require('./routes/list.js')(apiRoutes);
require('./routes/item.js')(apiRoutes);

app.use('/api', apiRoutes);


app.listen(port);
console.log("App listening on port " + port);