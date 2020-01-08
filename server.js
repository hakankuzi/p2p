// Dependencies ---------------------
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var app = express();
var http = require('http');
var server = http.Server(app);


// Express -------------------------
app.use(bodyParser.urlencoded({
    limit: '5mb',
    parameterLimit: 100000,
    extended: false
}));

app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(morgan('dev'));
app.use(express.static(__dirname + '/app/public'));

//Routes ---------------------------
var api = require(__dirname + '/app/backend/api');
app.use('/api', api);



app.get('*', function (req, res) {
    res.sendFile(__dirname + '/app/public/views/index.html');
});

// Start Server ---------------------
server.listen(config.port, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('Listening Port :', config.port);
    }
});
