'use strict'
var P2PService = angular.module('P2PService', []);

P2PService.service('P2P', function ($http, $q) {

    var P2PService = {};
    var p;

    var socket = io.connect();
    var random = parseInt(Math.random() * 20);
    var students = [];
    var local_stream;



    P2PService.test = function () {}

    // Connection and Default Config --------------
    socket.on('connect', (data) => {});
    // ---------------------------------------------

    P2PService.addClient = function (role) {
        if (role == 'teacher') {

            socket.emit('add-client', {
                customid: 'teacher-custom'
            });

        } else if (role == 'student') {

            socket.emit('add-client', {
                customid: 'student-' + random
            });
        }
    }

    // if teacher and generate room ----------------
    socket.on('result-generate-room', (data) => {
        console.log(data.status);

        // ---------------------
    });
    // --------------------------------------------

    // if student and join room ------------------
    socket.on('result-join-room', (data) => {
        console.log('result-join', data.status);

        // Enroll Lesson -------------------------
        socket.emit('enroll-lesson', {
            room: 'teacher-1',
            customid: 'student-' + random,
            live: 'online'
        });
        // ---------------------------------------
    });
    // -------------------------------------------


    socket.on('generate-token', (data) => {
        let result = false;
        var count = false;
        for (let i = 0; i < students.length; i++) {
            let student = students[i];
            if (student.customid == data.customid) {
                result = true;
                break;
            }
        }

        if (result == false) {


            p = new SimplePeer({
                initiator: true,
                trickle: false,
            });

            p.addStream(local_stream);

            let student = data;
            student.p = p;


            student.p.on('connect', () => {
                student.p.on('data', data => {
                    console.log('' + data);
                });
            });

            student.p.on('negotiate ', (data) => {
                console.log(data);
            })

            student.p.on('stream', (remoteStream) => {
                let div = document.getElementById('clients');
                let video = document.createElement('video');
                video.srcObject = remoteStream;
                video.autoplay = true;
                div.appendChild(video);

            });

            student.p.on('signal', (token) => {

                if (count == false) {
                    document.getElementById('minetoken').value = JSON.stringify(token);
                    socket.emit('teacher-token', {
                        token: token,
                        customid: data.customid,
                        room: 'teacher-custom',
                        live: 'online'
                    });

                    count = true;

                }
            });


            students.push(student);





        }
    });


    socket.on('teacher-token', (data) => {


        p = new SimplePeer({
            initiator: false,
            trickle: false,
        });
        p.addStream(local_stream);
        p.signal(data.token);


        p.on('negotiate ', (data) => {
            console.log(data);
        })



        p.on('signal', (token) => {
            document.getElementById('othertoken').value = JSON.stringify(data.token);
            document.getElementById('minetoken').value = JSON.stringify(token);
            socket.emit('student-token', {
                token: token,
                customid: 'student-' + random
            });
        });

        p.on('stream', (remoteStream) => {
            let div = document.getElementById('clients');
            let video = document.createElement('video');
            video.srcObject = remoteStream;
            video.autoplay = true;
            div.appendChild(video);;
        });

        p.on('connect', () => {
            p.send('hello')
        });





    });


    socket.on('student-token', (data) => {



        document.getElementById('othertoken').value = JSON.stringify(data.token);

        for (let i = 0; i < students.length; i++) {
            let student = students[i];
            if (student.customid == data.customid) {
                student.p.signal(data.token);
                break;
            }
        }
    });


    P2PService.doLesson = function (grade) {


        P2PService.getStream((stream) => {
            local_stream = stream;
            if (grade == 'teacher') {
                socket.emit('generate-room', {
                    room: 'teacher-1',
                    customid: 'teacher-custom',
                    live: 'online'
                });
            } else if (grade == 'student') {
                socket.emit('join-room', {
                    room: 'teacher-1',
                    customid: 'student-' + random,
                    live: 'online'
                });
            }
        })



    }


    // GetStream -----------------------------------
    P2PService.getStream = function (callback) {
        navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
        }).then((stream) => {
            callback(stream);
        });
    }
    // ---------------------------------------------

    // Open Camera ---------------------------------
    P2PService.openStream = function (videoId, callback) {
        P2PService.getStream((stream) => {

            var video = document.getElementById(videoId);
            video.srcObject = stream;
            video.onloadeddata = function () {
                video.play();
                callback('success');
            }

            p = new SimplePeer({
                initiator: location.hash === '#peer',
                trickle: false,
            });




            /*
            //  after connected peers it's working
            p.on('connect', () => {
                setInterval(() => p.send(Math.random()), 200);
            });

            p.on('data', (data) => {
                console.log(data);
            });
            */


            p.on('signal', (token) => {

                document.getElementById('minetoken').value = JSON.stringify(token);
            });

            p.on('stream', (remoteStream) => {
                var othervideo = document.getElementById('otherside');
                othervideo.srcObject = remoteStream;
                othervideo.play();
            });

        });
    }
    // ---------------------------------------------

    // Connect Peer --------------------------------
    P2PService.connectPeer = function (token) {
        let othertoken = JSON.parse(token);
        p.signal(othertoken);
    }
    // ---------------------------------------------










    return P2PService;
});