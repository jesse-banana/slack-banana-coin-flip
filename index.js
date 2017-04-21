var express = require('express');
var http = require('http');
var bodyParser = require('body-parser');
var basicAuth = require('basic-auth');
var moment = require('moment');
var methodOverride = require('method-override');
var request = require('request');

//
// create the express server
//
var app = express( );

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Global app configuration section
//
app.set('views', './cloud/views'); // Specify the folder to find templates
app.set('view engine', 'ejs'); // Set the template engine
app.use(express.static('public'));

app.get('/oauth', function(req, res) {
  if(!req.query.code) {
    res.status(500);
    res.send({"Error": "Looks like we're not getting code."});
    console.log("Looks like we're not getting code.");
  } else {
    request({
      url: 'https://slack.com/api/oauth.access',
      qs: {code: req.query.code, client_id: process.env.CLIENT_ID, client_secret: process.env.CLIENT_SECRET},
      method: 'GET'
    }, function(error, response, body) {
      if(error) {
        console.log(error);
      } else {
        res.json(body);
      }
    })
  }
});

app.post('/flip', function( req, res ) {

  var fallbackText = 'Heads';
  var url = 'https://banana-transfer.s3.amazonaws.com/heads.png'

  if( Math.random() <= 0.5 ) {
    fallbackText = 'Tails';
    url = 'http://banana-transfer.s3.amazonaws.com/tails.png';
  }

  var message = req.body.user_name + " flipped a coin. Heads means " + req.body.text;

  res.status( 200 ).send( {
    text: message,
    response_type: "in_channel",
    attachments: [{
      fallback: fallbackText,
      image_url: url
    }]
  } );
} );

//
// start the server
//
var port = process.env.PORT || 5000;
var httpServer = http.createServer( app );
httpServer.listen( port, function( ) {
  console.log( 'Running on port ' + port + '...' );
} );
