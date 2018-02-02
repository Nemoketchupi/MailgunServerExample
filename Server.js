console.log('Starting server...')
/*

*/

console.log('-- Declare variables')
// HTTPS
var fs = require('fs');
var https = require('https');
var options = {
  key: fs.readFileSync('keys/server-no-key.pem', 'utf8'),
  cert: fs.readFileSync('keys/server-cert.pem', 'utf8')
};

// MAILGUN
var api_key = 'key-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var domain = 'sandboxc191221352634d889276e68aa6e0db46.mailgun.org';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

// EXPRESS AND BODY PARSING
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();

console.log('-- Define body parser');
app.use(bodyParser.urlencoded({ extended: true }));

console.log('-- Define routes');
// POST ROUTE
app.post('/', function(req, res){
    console.log('form submitted : ' + req.body.text);
    if (req.body.text.indexOf('@fake-box.com') <= 0) {
      console.log('invalid mail adress => no action');

    } else {
      console.log('valid mail adress => send mail to adress')

      var data = {
        from: 'Excited User <nemoketchupi@fake-box.com>',
        to: req.body.text,
        subject: 'test',
        text: 'test'
      };

      mailgun.messages().send(data, function (error, body) {
        console.log(error);
        console.log(body);
      });
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})
// DEFAULT ROUTE
.get('/*', function(req, res, next){
    console.log('default route');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
})

console.log('-- Create server');
var httpsServer = https.createServer(options, app);

console.log('\nListening on 8080 port (https protocol)');
httpsServer.listen(8080);

console.log('The server is now running');
