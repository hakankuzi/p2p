// Dependencies --------------------------
const express = require('express');
const jwt = require('jsonwebtoken');
var secretKey = "tokbox-sample-123456";
const router = express.Router();

// Firebase Connection --------------------
const fbadmin = require('firebase-admin');
const account = require('../backend/accountKey.json');

fbadmin.initializeApp({
    credential: fbadmin.credential.cert(account),
    databaseURL: "https://online-school-dev.firebaseio.com",
    storageBucket: "online-school-dev.appspot.com"
});

const dbstore = fbadmin.firestore();
// Tokbox -----------------------------------------------

const OpenTok = require('opentok');
let tokboxApiKey = '46488052';
let tokboxSecretKey =  '2c86770ac45f5ac8ae8860356535e97af293a116';
const opentok = new OpenTok(tokboxApiKey, tokboxSecretKey);

// get sessionId by scheduleId --------------------------------------------------------- 
router.post('/getSessionByScheduleId', (req,res)=>{
    let item = req.body.item;
    dbstore.collection('sessions').where('scheduleId', '==', item.scheduleId).get().then((snapshot)=>{
        if(snapshot.docs.length ===0){
            res.json({
                status : '409',
                message : 'no session',
                sessionId : null
            });
        }else{  
            let document = snapshot.docs[0].data();
            res.json({
                status : '200',
                message : 'got successfully',
                sessionId : document.sessionId 
            });
        }
    }).catch((error)=>{
        res.json({
            status : '409',
            message: error,
            sessionId : null
        });
    });
});
// -------------------------------------------------------------------------------

// generating Tokens -------------------------------------------------------------
router.post('/generateToken',(req,res)=>{
    let item = req.body.item;
    dbstore.collection('sessions').where('scheduleId', '==', item.scheduleId).get().then((snapshot)=>{

        if(snapshot.docs.length ===0){
            res.json({
                status : '409',
                message : 'no session'
            });
        }else{
            let item = snapshot.docs[0].data();
            let token= opentok.generateToken(item.sessionId);
            item.token = token
            res.json({
                status: '200',
                message : 'got successfully',
                document : item
            });
        }
    }).catch((error)=>{
        res.json({
                status : '409',
                message : error,
                document : null
        });
    });
});
// -------------------------------------------------------------------------------


// Create a session that will attempt to transmit streams directly between clients
// If clients cannot connect, the session uses the OpenTok TURN SERVER
// create tokbox session ----------------------------------------------------------
router.post('/createSession', (req,res)=>{
    let item = req.body.item;
    opentok.createSession((err, session)=> {
        if(err){
            res.json({
                status : '409',
                message:err,
                document : null
            });
        }else{
            // save the sessionId
            item.sessionId = session.sessionId;
            item.mediaMode = session.mediaMode;
            item.archiveMode = session.archiveMode;
            dbstore.collection('sessions').add(item).then((snapshot=>{
                res.json({
                    status : '200',
                    message : 'session is created successfully',
                    document : item
                });
            })).catch((error)=>{
                res.json({
                    status : '409',
                    message : error,
                    document : null
                });
            });          
        }
      });
});
// ----------------------------------------------------------------------------


// 





// -----------------------------------------------------

// MiddleWare -------------------------
router.use(function (req, res, next) {
    var token = req.body.token || req.body.query || req.headers['x-access-token'];

    if (token) {
        // verify token
        jwt.verify(token, secretKey, function (err, decoded) {
            if (err) {
                res.json({
                    status: 412,
                    message: 'Token invalid'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });

    } else {
        res.json({
            status: 412,
            message: 'No token provide'
        });
    }
});





// Return Router
module.exports = router;