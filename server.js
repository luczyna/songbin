const path = require('path');
const http = require('http');
const express = require('express');

const app = express();
let server;

app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// app.listen(process.env.PORT || 8080);
server = http.createServer(app).listen(process.env.PORT || 8080);
