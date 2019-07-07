'use strict'
var P2PService = angular.module('P2PService', []);

P2PService.service('P2P', function ($http, $q) {

    var P2PService = {};
    var p;

    var socket = io.connect();
    var random = parseInt(Math.random() * 20);
    var students = [];
    var local_stream;
    var ICE_SERVERS = [{
        urls: "stun:stun.l.google.com:19302"
    }, {
        urls: 'turn:numb.viagenie.ca:3478',
        credential: 'Hk5967245.', //your  password
        username: 'coreteameng@email.com'
    }];



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
                config: {
                    iceServers: ICE_SERVERS
                },
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
            config: {
                iceServers: ICE_SERVERS
            },
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
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        // ----------------------------------------------------------------------------------------------------------------------------------------------------------------------
        let parameters = {
            audio: true,
            video: true
        }


        // Older browsers might not implement mediaDevices at all, so we set an empty object first
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }
        // -------------------------------------------------------------------------------------
        // Some browsers partially implement mediaDevices. We can't just assign an object
        // with getUserMedia as it would overwrite existing properties.
        // Here, we will just add the getUserMedia property if it's missing.
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function (constraints) {

                // First get ahold of the legacy getUserMedia, if present
                var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

                // Some browsers just don't implement it - return a rejected promise with an error
                // to keep a consistent interface
                if (!getUserMedia) {
                    return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
                }

                // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            }
        }
        // -----------------------------------------------------------------------------------------
        navigator.mediaDevices.getUserMedia(parameters).then(function (stream) {
            callback(stream);
        }).catch(function (error) {
            if (error.name === 'ConstraintNotSatisfiedError') {
                console.log('The resolution ' + constraints.video.width.exact + 'x' +
                    constraints.video.width.exact + ' px is not supported by your device.');
            } else if (error.name === 'PermissionDeniedError') {
                console.log('Permissions have not been granted to use your camera and ' +
                    'microphone, you need to allow the page access to your devices in ' +
                    'order for the demo to work.');
            }
            console.log('getUserMedia error: ' + error.name, error);
        });
        // ------------------------------------------------------------------------------------------







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