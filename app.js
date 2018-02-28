var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
/* require('./helper/helper')(exphbs); */
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/loginapp');
var db = mongoose.connection;

var routes = require('./routes/index');
var users = require('./routes/users');
var device = require('./routes/device');
var product = require('./routes/product');
var file = require('./routes/file');
var company = require('./routes/company');
var scheduler = require('./routes/scheduler');
var playlist = require('./routes/playlist');
var api = require('./routes/api');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
  
  defaultLayout:'default',
  helpers:{
    // Function to do basic mathematical operation in handlebar
    math: function(lvalue, operator, rvalue) {
      lvalue = parseFloat(lvalue);
        rvalue = parseFloat(rvalue);
        return {
            "+": lvalue + rvalue,
            "-": lvalue - rvalue,
            "*": lvalue * rvalue,
            "/": lvalue / rvalue,
            "%": lvalue % rvalue
        }[operator];
    },
    compare: function(lvalue, rvalue, options) {

            if (arguments.length < 3)
                throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
  
                var operator = options.hash.operator || "==";
            
                var operators = {
                    '==':       function(l,r) { return l == r; },
                    '===':      function(l,r) { return l === r; },
                    '!=':       function(l,r) { return l != r; },
                    '<':        function(l,r) { return l < r; },
                    '>':        function(l,r) { return l > r; },
                    '<=':       function(l,r) { return l <= r; },
                    '>=':       function(l,r) { return l >= r; },
                    'typeof':   function(l,r) { return typeof l == r; }
                }
  
              if (!operators[operator])
                  throw new Error("Handlerbars Helper 'compare' doesn't know the operator "+operator);
          
              var result = operators[operator](lvalue,rvalue);
          
              if( result ) {
                  return options.fn(this);
              } else {
                  return options.inverse(this);
              }
          
       },
       select :function(selected, options) {
              return options.fn(this).replace(
                  new RegExp(' value=\"' + selected + '\"'),
                  '$& selected="selected"');
            }
  }


}));

app.set('view engine', 'handlebars');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes);
app.use('/users', users);
app.use('/device', device);
app.use('/product', product);
app.use('/file', file);
app.use('/company', company);
app.use('/scheduler', scheduler);
app.use('/playlist', playlist);
app.use('/api', api);
// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port'));
});