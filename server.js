var express = require('express')
var app = express()
var IP_ADDRESS = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var PORT = process.env.OPENSHIFT_NODEJS_PORT || 8080;

app.get('/', function (req, res) {
  res.send('Hello World!<br>'+process.env.OPENSHIFT_MONGODB_DB_URL);
})

app.listen(PORT, IP_ADDRESS, function() {
  console.log("✔ Express server listening on port %d in %s mode", PORT, app.settings.env);
});



