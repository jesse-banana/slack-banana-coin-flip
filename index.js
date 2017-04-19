var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var basicAuth = require('basic-auth');
var moment = require('moment');
var methodOverride = require('method-override');

//
// create the express server
//
var app = express( );

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//
// setup web endpoints
//
var auth = function (req, res, next) {
  function unauthorized(res) {
    console.log( "unauthorized " + req.url );
    res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
    return res.sendStatus(401);
  };

  var user = basicAuth(req);

  if (!user || !user.name || !user.pass) {
    return unauthorized(res);
  };

  if( user.name === process.env.ADMIN_AUTH_USER && user.pass === process.env.ADMIN_AUTH_PASSWORD ) {
    return next();
  } else {
    return unauthorized(res);
  };
};

//
// Global app configuration section
//
app.set('views', './cloud/views'); // Specify the folder to find templates
app.set('view engine', 'ejs'); // Set the template engine
app.use(express.static('public'));

//
// view an app
//
app.post('/', function( req, res ) {
  res.status( 200 ).send( "http://www.marshu.com/articles/images-website/articles/presidents-on-coins/half-dollar-coin-head.jpg" );
} );

//
// start the server
//
var port = process.env.PORT || 5000;
var httpServer = http.createServer( app );
httpServer.listen( port, function( ) {
  console.log( 'parse-server running on port ' + port + '...' );
} );