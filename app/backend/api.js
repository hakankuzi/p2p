// Dependencies --------------------------
const express = require('express');
const jwt = require('jsonwebtoken');
var secretKey = "timetohelp123456781234566";
const router = express.Router();

// Firebase Connection --------------------
const fbadmin = require('firebase-admin');
const account = require('../backend/accountKey.json');
fbadmin.initializeApp({
    credential: fbadmin.credential.cert(account),
    databaseURL: ""
});
const dbstore = fbadmin.firestore();




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