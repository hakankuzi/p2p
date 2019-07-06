'use strict'
var P2PService = angular.module('P2PService', []);

P2PService.service('P2P', function ($http, $q) {

    var P2PService = {};
    var p;

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
                stream
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
                console.log(JSON.stringify(token));
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