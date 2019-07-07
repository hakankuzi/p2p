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

// ------------- SOCKET AND WEBRTC ----------------------
const clients = [];
const roomlist = [];
var io = require('socket.io')(server);


io.sockets.on('connection', (socket) => {

    // Generate Room -----------------------
    socket.on('generate-room', (data) => {
        let result = false;
        let status = 'noaction'
        for (let i = 0; i < roomlist.length; i++) {
            let room = roomlist[i];
            if (room.room === data.room) {
                result = true;
                status = 'existed';
                break;
            }
        }

        if (result == false) {
            roomlist.push(data);
            status = 'generated';
        }

        console.log(roomlist);
        socket.emit('result-generate-room', {
            status: status
        });

    });
    // -----------------------------------------

    // Join Room ------------------------------
    socket.on('join-room', (data) => {
        for (let i = 0; i < roomlist.length; i++) {
            let room = roomlist[i];
            if (room.room == data.room) {
                socket.join(room, () => {
                    socket.emit('result-join-room', {
                        status: 'joined'
                    });
                });
                break;
            }
        }

        console.log(roomlist);

    });
    // -----------------------------------------


    // enroll-lesson ---------------------------
    socket.on('enroll-lesson', (data) => {
        for (let i = 0; i < clients.length; i++) {
            var c = clients[i];
            if (c.customid == 'teacher-custom') {
                c.socket.emit('generate-token', {
                    room: data.room,
                    customid: data.customid,
                    live: data.live
                });
                break;
            }
        }

    });
    // ----------------------------------------

    // teacher-token --------------------------
    socket.on('teacher-token', (data) => {
        console.log('server teacher token :', data.customid);
        for (let i = 0; i < clients.length; i++) {
            var c = clients[i];
            if (c.customid === data.customid) {

                console.log('server teacher token custom id ', c.customid);

                c.socket.emit('teacher-token', {
                    token: data.token,
                    room: data.room,
                    live: data.live
                });
                break;
            }
        }
    });


    socket.on('student-token', (data) => {
        for (let i = 0; i < clients.length; i++) {
            var c = clients[i];
            if (c.customid === 'teacher-custom') {

                console.log('student-token customid', c.customid);

                c.socket.emit('student-token', {
                    token: data.token,
                    customid: data.customid
                });
                break;
            }
        }
    });


    // add-client ------------------------------
    socket.on('add-client', (data) => {

        var result = false;
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].customid === data.customid) {
                result = true;
                console.log('existed');
                break;
            }
        }
        if (result == false) {
            let client = new Object();
            client.socket = socket;
            client.customid = data.customid;
            client.id = socket.id;
            clients.push(client);
            console.log('added')
        }

    });
    // ------------------------------------------


    // disconnect --------------------------------
    socket.on('disconnect', (data) => {
        // Client Remove --------------------------
        for (let i = 0; i < clients.length; i++) {
            var c = clients[i];
            if (c.id === socket.id) {
                clients.splice(i, 1);
                break;
            }
        }
        // ----------------------------------------

    });
    // --------------------------------------------


});